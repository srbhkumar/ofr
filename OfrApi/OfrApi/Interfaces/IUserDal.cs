using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace OfrApi.Interfaces
{
    public interface IUserDal
    {
        Task<string> GetGroupsById(string userId);
        List<string> GetGroupsFromHeader(HttpRequestMessage request);
    }
}