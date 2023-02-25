import { Bucket, StackContext, Cognito, Api } from "sst/constructs";

export function ReplayApi({ stack }: StackContext) {
  // Create User Pool
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
    cdk: {
      userPool: {
        selfSignUpEnabled: true,
        userPoolName: "star2statsusers",
      },
      userPoolClient: {
        generateSecret: false,
      },
    },
  });

  auth.cdk.userPool.addDomain("star2stats", {
    cognitoDomain: {
      domainPrefix: "star2stats",
    },
  });

  const api = new Api(stack, "api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
    },
    routes: {
      "PUT /upload/{replay}": "packages/functions/src/upload.main",
      "GET /replay/{replay}": "packages/functions/src/replay.main",
    },
    cdk: {
      httpApi: {},
    },
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  const bucket = new Bucket(stack, "ReplayBucket", {
    name: "star2stats-replays",
  });

  api.bind([bucket]);

  // Show the API endpoint and other info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
}
