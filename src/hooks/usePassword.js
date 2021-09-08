import { ref } from '@vue/composition-api'

export default function usePassword() {
  const HashOptions = ref(['plain', 'md5', 'sha', 'sha256', 'sha512', 'bcrypt'])
  return {
    HashOptions,
  }
}
