﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Owin.Security.Jwt;
using System.IdentityModel.Tokens;
using System.Threading;
using Microsoft.IdentityModel.Protocols;

namespace OfrApi.App_Start
{
    // Example code pulled from microsoft documentation
    // see : https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-devquickstarts-api-dotnet
    // This class is necessary because the OAuthBearer Middleware does not leverage
    // the OpenID Connect metadata endpoint exposed by the STS by default.
    public class OpenIdConnectCachingSecurityTokenProvider : IIssuerSecurityTokenProvider
    {
        public ConfigurationManager<OpenIdConnectConfiguration> _configManager { get; set; }
        private string _issuer;
        private IEnumerable<SecurityToken> _tokens;
        private readonly string _metadataEndpoint;

        private readonly ReaderWriterLockSlim _synclock = new ReaderWriterLockSlim();

        public OpenIdConnectCachingSecurityTokenProvider(string metadataEndpoint)
        {
            _metadataEndpoint = metadataEndpoint;
            _configManager = new ConfigurationManager<OpenIdConnectConfiguration>(metadataEndpoint);

            RetrieveMetadata();
        }

        /// <summary>
        /// Gets the issuer the credentials are for.
        /// </summary>
        /// <value>
        /// The issuer the credentials are for.
        /// </value>
        public string Issuer
        {
            get
            {
                RetrieveMetadata();
                _synclock.EnterReadLock();
                try
                {
                    return _issuer;
                }
                finally
                {
                    _synclock.ExitReadLock();
                }
            }
        }

        /// <summary>
        /// Gets all known security tokens.
        /// </summary>
        /// <value>
        /// All known security tokens.
        /// </value>
        public IEnumerable<SecurityToken> SecurityTokens
        {
            get
            {
                RetrieveMetadata();
                _synclock.EnterReadLock();
                try
                {
                    return _tokens;
                }
                finally
                {
                    _synclock.ExitReadLock();
                }
            }
        }

        private void RetrieveMetadata()
        {
            _synclock.EnterWriteLock();
            try
            {
                OpenIdConnectConfiguration config = Task.Run(_configManager.GetConfigurationAsync).Result;
                _issuer = config.Issuer;
                _tokens = config.SigningTokens;
            }
            finally
            {
                _synclock.ExitWriteLock();
            }
        }
    }
}