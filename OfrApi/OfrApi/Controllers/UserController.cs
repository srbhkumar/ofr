using OfrApi.Services;
using System.Threading.Tasks;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        [Route("groups/{id}")]
        public async Task<string> Get(string id)
        {
            var groups = await new UserDal().GetGroupsById(id);
            groups = new EncryptionService().Encrypt(groups);
            return groups;
        }

    }
}
