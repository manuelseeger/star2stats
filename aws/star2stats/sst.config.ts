import { SSTConfig } from "sst";
import { ReplayApi } from "./stacks/ReplayApi";

export default {
  config(_input) {
    return {
      name: "star2stats",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(ReplayApi);
  },
} satisfies SSTConfig;
