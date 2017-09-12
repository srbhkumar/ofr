import {Component} from '@angular/core';


export class Constant
{
  public rootUrl = "http://localhost:62913/api";
  public headerSubscriptionKey : string = "Ocp-Apim-Subscription-Key";
  public headerSubscriptionValue : string = "69c8009e9b974124b76d1dad24afb75f";
 
}


enum CaseStatus{
  Available,
  Assigned,
  Dismissed,
  Submitted,
  Flagged,
  Unflagged
}
 