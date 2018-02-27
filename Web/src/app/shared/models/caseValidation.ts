export class CaseInfo {
    key: string;
    value?: string | number | boolean;
    IsRequired?: boolean;
    IsGroupValid?: boolean;
    Type?: string;
}

class Control {
    FiledName: string;
    Type: string;
    subGroupTitle: string;
}

export class RequiredFieldGroup {
    private static RequiredGroup: RequiredFieldGroup[] = [];

    public key: string;
    public type: string;
    public fieldIds?: Control[];
    public isAllRequired: boolean;

    public static addRequiredGroup(groupName: string, type: string, fieldName: string,
        subGroupTitle: string, isAllRequired: boolean): void {
        if (!this.RequiredGroup.find(x => x.key == groupName)) {
            this.RequiredGroup.push({ key: groupName, type: type, fieldIds: [], isAllRequired });
        }

        const fields = this.RequiredGroup.find(x => x.key == groupName);
        if (fields.fieldIds.filter(y => y.FiledName == fieldName).length == 0 || fields.fieldIds.length == 0) {
            this.RequiredGroup.find(x => x.key == groupName).fieldIds.push(
                { FiledName: fieldName, Type: type, subGroupTitle: subGroupTitle });
        }
    }

    public static getRequiredGroup(): RequiredFieldGroup[] {
        return this.RequiredGroup;
    }

    private static isFieldValid(fieldType: string, fieldValue: string): boolean {
        if ((fieldType == 'Checkbox' && fieldValue.toString().toLowerCase() == 'true')
            || (fieldType != 'Checkbox' && fieldValue)) {
            return true;
        } else {
            return false;
        }
    }

    public static isRequiredGroupValid(groupName: string): boolean {
        let subGroupTitle = '';
        let isDataPresent = false;
        let isNotDataPresent = false;
        let isException = false;

        const fields = this.RequiredGroup.find(x => x.key == groupName).fieldIds;
        const isAllRequired = this.RequiredGroup.find(x => x.key == groupName).isAllRequired;

        fields.forEach(item => {

            const dataValue = CaseData.getCaseData().find(x => x.key == item.FiledName);

            if (dataValue) {
                if (!item.subGroupTitle) {
                    if (item.Type == 'Checkbox' && dataValue.value.toString().toLowerCase() == 'false') {
                        isException = true;
                    } else if (item.Type != 'Checkbox' && !dataValue.value) {
                        isException = true;
                    }

                    if (item.Type == 'Checkbox' && dataValue.value.toString().toLowerCase() == 'true') {
                        isDataPresent = true
                    } else if (item.Type != 'Checkbox' && dataValue.value) {
                        isDataPresent = true
                    }
                } else {

                    if (item.Type == 'Checkbox' && dataValue.value.toString().toLowerCase() == 'true') {
                        isDataPresent = true;
                    } else if (item.Type != 'Checkbox' && dataValue.value) {
                        isDataPresent = true;
                    }

                    if (item.Type == 'Checkbox' && dataValue.value.toString().toLowerCase() == 'false') {
                        isNotDataPresent = true;
                    } else if (item.Type != 'Checkbox' && !dataValue.value) {
                        isNotDataPresent = true;
                    }

                    subGroupTitle = item.subGroupTitle;
                }
            }

        });

        if (!isDataPresent && isNotDataPresent) {
            isException = true;
        }

        if (!isAllRequired && isException && !isDataPresent) {
            return true;
        } else if (isAllRequired && isException && isDataPresent) {
            return true;
        } else if (isAllRequired && !isException && isDataPresent) {
            return false;
        } else {
            return false;
        }
    }
    private static isDataExists(groupName: string): boolean {
        let isDataPresent = false;

        const fields = this.RequiredGroup.find(x => x.key == groupName).fieldIds;
        const isAllRequired = this.RequiredGroup.find(x => x.key == groupName).isAllRequired;

        fields.forEach(item => {
            const dataValue = CaseData.getCaseData().find(x => x.key == item.FiledName);

            if (dataValue) {
                if (RequiredFieldGroup.isFieldValid(item.Type, dataValue.value.toString().toLowerCase())) {
                    isDataPresent = true;
                }
            }
        });
        return isDataPresent;
    }

    public static isInnerGroupValid(parentGroupName: string, groupName: string): boolean {
        return (RequiredFieldGroup.isDataExists(parentGroupName) && !RequiredFieldGroup.isDataExists(groupName));
    }
}

export class CaseData {
    private static Data: CaseInfo[] = [];
    public static changeset: any = {};
    public static OnChange: () => void;

    public static getCaseData(): CaseInfo[] {
        return CaseData.Data;
    }

    public static setCaseData(data: CaseInfo): void {
        if (CaseData.Data.find(x => x.key == data.key)) {
            CaseData.Data.find(x => x.key == data.key).value = data.value;
            CaseData.Data.find(x => x.key == data.key).IsGroupValid = data.IsGroupValid;
        } else {
            CaseData.Data.push(data);
        }
    }

    public static isValid(): boolean {
        const isCheckBoxValid = (CaseData.Data.filter(x => x.Type == 'Checkbox' && x.IsRequired == true
            && x.value.toString().toLowerCase() == 'false').length > 0);

        const isOtherControlValid = (CaseData.Data.filter(x => x.Type != 'Checkbox' && x.IsRequired == true
            && (x.value == '' || x.value == null)).length > 0);

        const isGroupValid = (CaseData.Data.filter(x => x.IsGroupValid == false).length > 0)    

        return (isCheckBoxValid || isOtherControlValid || isGroupValid);
    }
}
