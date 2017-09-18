using OfrApi.Interfaces;
using OfrApi.Services;
using System.Threading.Tasks;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        private IUserDal _userDal { get; }

        public UserController()
        {
            _userDal = new UserDal();
        }

        public UserController(IUserDal userDal)
        {
            _userDal = userDal;
        }
        [Route("groups/{id}")]
        public async Task<string> Get(string id)
        {
            var groups = await new UserDal().GetGroupsById(id);
            groups = EncryptionService.Encrypt(groups);
            return groups;
        }

    }
}
