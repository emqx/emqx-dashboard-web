export default {
  __not: [
    '应用为调用', // 呼び出し
    '认证凭证，通过', // 認証が成功しました
    '可查询', // 検索可能
    '调整', // 調整
    '集群信息，对设备进行管理操作', // クラスター情報、設備を管理します
    '请求一组数据', // データセットをリクエストする
    '密码长度为三到三十二位', // パスワードの長さは3～32文字です
    '密码长度为三到三十二位', // パスワードの長さは3～32文字です
    '取消修改密码，删除密码数据', // パスワードの変更を破棄して、データを削除します
  ],
  confirmDelete: {
    zh: '确认删除应用?',
    ja: '削除してもよろしいですか?',
    en: 'Confirm delete?',
  },
  applicationIsCalled: {
    zh: '应用为调用 REST API 认证凭证，通过 REST API 可查询、调整 EMQ X 集群信息，对设备进行管理操作',
    ja:
      'アプリケーションはRESTAPIを介して認証を行った後、EMQ Xクラスタ情報の照会・調整、デバイス上での管理することができます。',
    en:
      'In order to invoke the certificate of REST API, the application can query and adjust EMQ X cluster information through REST API, and manage and operate the equipment',
  },
  appId: {
    zh: '应用 ID',
    ja: 'アプリ ID',
    en: 'AppID',
  },
  application: {
    zh: '应用',
    ja: 'アプリケーション',
    en: 'Application',
  },
  productDocumentation: {
    zh: '产品文档',
    ja: 'ドキュメント',
    en: 'Document',
  },
  appName: {
    zh: '应用名称',
    ja: 'アプリ名',
    en: 'App Name',
  },
  expireAt: {
    zh: '到期时间',
    ja: '失効日時',
    en: 'Expire At',
  },
  remark: {
    zh: '备注',
    ja: '備考',
    en: 'Remark',
  },
  isEnabled: {
    zh: '是否启用',
    ja: '有効フラグ',
    en: 'Is Enabled',
  },
  enabled: {
    zh: '启用',
    ja: '有効',
    en: 'Enabled',
  },
  edit: {
    zh: '编辑',
    ja: '編集',
    en: 'Edit',
  },
  delete: {
    zh: '删除',
    ja: '削除',
    en: 'Delete',
  },
  editApp: {
    zh: '编辑应用',
    ja: 'アプリ編集',
    en: 'Edit',
  },
  createApp: {
    zh: '创建应用',
    ja: '新規アプリ',
    en: 'Create App',
  },
  secret: {
    zh: '密钥',
    ja: 'シークレット',
    en: 'Secret',
  },
  disabled: {
    zh: '不启用',
    ja: '無効',
    en: 'Disabled',
  },
  pleaseEnterAppName: {
    zh: '请输入应用名称',
    ja: 'アプリ名称を入力してください',
    en: 'Please enter the app name.',
  },
  pleaseEnterTheAppId: {
    zh: '请输入应用 ID',
    ja: 'アプリIDを入力してください',
    en: 'Please enter the appid',
  },
  pleaseChoose: {
    zh: '请选择',
    ja: '選択してください',
    en: 'Please select',
  },
  pleaseEnter: {
    zh: '请输入',
    ja: '入力してください',
    en: 'Please enter',
  },
  neverExpire: {
    zh: '永不过期',
    ja: '期限なし',
    en: 'Never expire',
  },
  editorialSuccess: {
    zh: '编辑成功',
    ja: '更新しました',
    en: 'Edit Success',
  },
  successfulAppCreation: {
    zh: '创建应用成功',
    ja: 'アプリが成功に作成しました',
    en: 'Successful app creation',
  },
  determineToDeleteTheApp: {
    zh: '确定删除该应用',
    ja: 'アプリを削除することを確認',
    en: 'Determine to delete the app',
  },
  successfulDeletion: {
    zh: '删除成功',
    ja: '削除が成功しました',
    en: 'Successful deletion',
  },
  cancelConfirm: {
    zh: '是否取消本次修改？',
    ja: '今回の編集内容を破棄しますか',
    en: 'You have unsaved changes, confirm cancel?',
  },
  confirm: {
    zh: '确认信息',
    ja: '確認',
    en: 'Confirm',
  },
  no: {
    zh: '不',
    ja: 'いいえ',
    en: 'NO',
  },
  user: {
    zh: '用户',
    ja: 'ユーザー',
    en: 'Users',
  },
  manageDashboardUsers: {
    zh: 'Dashboard 登录管理用户',
    ja: 'ダッシュボードのユーザー',
    en: 'Manage Dashboard users',
  },
  userName: {
    zh: '用户名',
    ja: 'ユーザー名',
    en: 'Username',
  },
  editorUser: {
    zh: '编辑用户',
    ja: 'ユーザー編集',
    en: 'Edit',
  },
  creatingUser: {
    zh: '创建用户',
    ja: '新規ユーザー',
    en: 'Create',
  },
  oldPassword: {
    zh: '旧密码',
    ja: '古いパスワード',
    en: 'Old password',
  },
  password: {
    zh: '密码',
    ja: 'パスワード',
    en: 'Password',
  },
  newPassword: {
    zh: '新密码',
    ja: '新しいパスワード',
    en: 'New password',
  },
  confirmPassword: {
    zh: '确认新密码',
    ja: 'パスワード確認用',
    en: 'Confirm password',
  },
  dontChangePassword: {
    zh: '不修改密码',
    ja: 'キャンセル',
    en: 'Dot change password',
  },
  changePassword: {
    zh: '修改密码',
    ja: 'パスワード変更',
    en: 'Change Password',
  },
  pleaseEnterYourPasswordAgain: {
    zh: '请再次输入密码',
    ja: 'パスワードをもう一度入力してください',
    en: 'Please enter your password again.',
  },
  confirmNotMatch: {
    zh: '两次输入密码不一致',
    ja: '新パスワードと再入力パスワードが一致しません',
    en: "Two inputs don't match!",
  },
  twoInconsistenciesInPasswordInput: {
    zh: '两次输入密码不一致',
    ja: '新パスワードと再入力パスワードが一致しません',
    en: 'Two inconsistencies in password input',
  },
  enterOneUserName: {
    zh: '请输入用户名',
    ja: 'ユーザー名を入力してください',
    en: 'Please enter username',
  },
  pleaseEnterNotes: {
    zh: '请输入备注',
    ja: '備考を入力してください',
    en: 'Please enter notes',
  },
  pleaseEnterPassword: {
    zh: '请输入密码',
    ja: '古いパスワードを入力してください',
    en: 'Please enter password',
  },
  pleaseEnterNewPassword: {
    zh: '请输入新密码',
    ja: '新しいパスワードを入力してください',
    en: 'Please enter new password',
  },
  pleaseEnterAConfirmationPassword: {
    zh: '请输入确认密码',
    ja: '新しいパスワードと同じ値を再度入力してください',
    en: 'Please enter confirm password.',
  },
  createUserSuccess: {
    zh: '创建用户成功',
    ja: 'ユーザーが成功に作成しました',
    en: 'Create User Success',
  },
  determineToDeleteTheUser: {
    zh: '确定删除该用户',
    ja: 'ユーザーが成功に削除しました',
    en: 'Confirm to delete the user',
  },
  passwordLength: {
    zh: '密码长度为 3~32 位',
    ja: 'パスワードの長さは3～32文字です',
    en: 'Password length is 3~32',
  },
  confirmDeleteUser: {
    zh: '确认删除该用户?',
    ja: 'ユーザーを削除してもよろしいですか?',
    en: 'Confirm delete?',
  },
  blacklistTips: {
    zh: '通过黑名单禁止客户端建立连接，该功能适用于管理少量客户端，客户端认证请使用',
    ja:
      'クライアントがブラックリストのエントリに一致する場合、接続が拒否されます。この機能は少数クライアントの認証をお勧めします',
    en:
      'The blacklist prohibits clients from establishing connections. This function is suitable for managing a small number of clients. For client authentication, view',
  },
  authDocs: {
    zh: '认证文档',
    ja: '認証ドキュメント',
    en: 'authentication document',
  },
  blacklist: {
    zh: '黑名单',
    ja: 'ブラックリスト',
    en: 'Blacklist',
  },
  createBlacklist: {
    zh: '创建黑名单',
    ja: 'ブラックリスト作成',
    en: 'Create',
  },
  determineToDeleteTheBlacklist: {
    zh: '确定删除该黑名单',
    ja: 'ブラックリストを削除してもよろしいですか',
    en: 'Determine to delete the blacklist',
  },
  createBlacklistSuccess: {
    zh: '创建黑名单成功',
    ja: 'ブラックリストが成功に更新しました',
    en: 'Create Blacklist Success',
  },
  who: {
    zh: '禁用值',
    ja: '値',
    en: 'Value',
  },
  as: {
    zh: '禁用属性',
    ja: 'プロパティ',
    en: 'Property',
  },
  reason: {
    zh: '原因',
    ja: '原因',
    en: 'Reason',
  },
  desc: {
    zh: '描述',
    ja: '詳細',
    en: 'Description',
  },
  until: {
    zh: '到期时间',
    ja: '失効日時',
    en: 'Until',
  },
  enterWho: {
    zh: '请输入禁用值',
    ja: '値を入力してください',
    en: 'Please enter value',
  },
  enterAs: {
    zh: '请选择禁用属性',
    ja: 'プロパティを選択してください',
    en: 'Please select property',
  },
}
