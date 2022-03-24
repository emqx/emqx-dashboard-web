const version = process.env.VUE_APP_VERSION

export default {
  en: {
    ruleEngineTutorial: `https://docs.emqx.com/en/enterprise/${version}/rule/rule-engine.html`,
    restAPI: `https://docs.emqx.com/en/enterprise/${version}/advanced/http-api.html`,
    schemaTutorial: `https://docs.emqx.com/en/enterprise/${version}/rule/schema-registry.html`,
    auth: `https://docs.emqx.com/en/enterprise/${version}/advanced/auth.html`,
    mnesia: `https://www.emqx.io/docs/en/${version}/advanced/auth-mnesia.html`,
    authJWT: `https://www.emqx.io/docs/en/${version}/advanced/auth-jwt.html`,
  },
  zh: {
    ruleEngineTutorial: `https://docs.emqx.com/zh/enterprise/${version}/rule/rule-engine.html`,
    restAPI: `https://docs.emqx.com/zh/enterprise/${version}/advanced/http-api.html`,
    schemaTutorial: `https://docs.emqx.com/zh/enterprise/${version}/rule/schema-registry.html`,
    auth: `https://docs.emqx.com/zh/enterprise/${version}/advanced/auth.html`,
    mnesia: `https://www.emqx.io/docs/zh/${version}/advanced/auth-mnesia.html`,
    authJWT: `https://www.emqx.io/docs/zh/${version}/advanced/auth-jwt.html`,
  },
}
