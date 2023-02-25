using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.Extensions.CognitoAuthentication;
using Amazon.Runtime;
using System.CommandLine;

var rootCommand = new RootCommand("Upload replays to replay stats db");

rootCommand.AddArgument(new Argument<string>("replayfile"));

// Create a new CognitoUserPool object
AmazonCognitoIdentityProviderClient provider =
    new AmazonCognitoIdentityProviderClient(new AnonymousAWSCredentials(), RegionEndpoint.USEast1);

var clientId = Environment.GetEnvironmentVariable("COGNITO_CLIENTID");
var password = Environment.GetEnvironmentVariable("COGNITO_PASSWORD");
var userId = Environment.GetEnvironmentVariable("COGNITO_USERID");
var poolId = Environment.GetEnvironmentVariable("COGNITO_POOLID");

// get filename from command line
if (args.Length != 1)
{
    Console.WriteLine("Usage: dotnet run <filename>");
    return;
}
else
{
    Console.WriteLine("Filename: " + args[0]);
}

CognitoUserPool userPool = new CognitoUserPool(poolId, clientId, provider);
CognitoUser user = new CognitoUser(userId, clientId, userPool, provider);
InitiateSrpAuthRequest authRequest = new InitiateSrpAuthRequest()
{
    Password = password
};

AuthFlowResponse authResponse = await user.StartWithSrpAuthAsync(authRequest).ConfigureAwait(false);

var idToken = authResponse.AuthenticationResult.IdToken;

if (authResponse.AuthenticationResult.IdToken != null)
{
    Console.WriteLine("IdToken: " + authResponse.AuthenticationResult.IdToken);
}

rootCommand.SetHandler((replayfile) =>
{
    Console.WriteLine(replayfile);
});