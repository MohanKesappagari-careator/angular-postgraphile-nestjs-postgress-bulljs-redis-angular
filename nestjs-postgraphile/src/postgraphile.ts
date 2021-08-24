import postgraphile from "postgraphile";
const { DATABASE, PG_USER, PASSWORD, HOST, PG_PORT } = process.env;
const { default: FederationPlugin } = require("@graphile/federation");
export const postgraph = postgraphile(
  "postgres://postgres:javascript@localhost:5432/student",
  "public",
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    enableCors: true,
    appendPlugins: [FederationPlugin],
  },
);
