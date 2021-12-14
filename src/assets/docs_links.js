const version = process.env.VUE_APP_VERSION

export default {
  en: {
    ruleEngineTutorial: `https://docs.emqx.io/en/enterprise/${version}/rule/rule-engine.html`,
    restAPI: `https://docs.emqx.io/en/enterprise/${version}/advanced/http-api.html`,
    schemaTutorial: `https://docs.emqx.io/en/enterprise/${version}/rule/schema-registry.html`,
    auth: `https://docs.emqx.io/en/enterprise/${version}/advanced/auth.html`,
    mnesia: `https://docs.emqx.io/en/broker/${version}/advanced/auth-mnesia.html`,
    authJWT: `https://docs.emqx.io/en/broker/${version}/advanced/auth-jwt.html`,
  },
  zh: {
    ruleEngineTutorial: `https://docs.emqx.cn/cn/enterprise/${version}/rule/rule-engine.html`,
    restAPI: `https://docs.emqx.cn/cn/enterprise/${version}/advanced/http-api.html`,
    schemaTutorial: `https://docs.emqx.cn/cn/enterprise/${version}/rule/schema-registry.html`,
    auth: `https://docs.emqx.cn/cn/enterprise/${version}/advanced/auth.html`,
    mnesia: `https://docs.emqx.cn/cn/broker/${version}/advanced/auth-mnesia.html`,
    authJWT: `https://docs.emqx.cn/cn/broker/${version}/advanced/auth-jwt.html`,
  },
}
