using System.Threading.Tasks;

namespace OfrApi.Interfaces
{
    public interface IUserDal
    {
        Task<string> GetGroupsById(string userId);
    }
}