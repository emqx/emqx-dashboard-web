import http from '@/common/http'

export const loadSchemas = () => http.get('/schemas')

export const viewSchema = async (id) => {
  try {
    const res = await http.get(`/schemas/${id}`)
    return res[0]
  } catch (error) {
    console.error(error)
    return false
  }
}

export const deleteSchema = async (id) => {
  try {
    return await http.delete(`/schemas/${id}`)
  } catch (error) {
    console.error(error)
    return false
  }
}

export const createSchema = async (data) => {
  const THIRD_PARTY = '3rd-party'
  const HTTP = 'HTTP'
  const TCP = 'TCP'
  const RESOURCES = 'Resources'

  const body = {
    name: data.name,
    description: data.description,
    parser_type: data.parser_type,
  }

  if (data.parser_type === THIRD_PARTY) {
    body.parser_addr = {}
    body.parser_opts = data.parser_opts
    if (data.third_party_type === HTTP) {
      body.parser_addr.url = data.parser_addr.url
    } else if (data.third_party_type === TCP) {
      body.parser_addr.server = data.parser_addr.server
    } else if (data.third_party_type === RESOURCES) {
      body.parser_addr.resource_id = data.parser_addr.resource_id
    }
  } else {
    body.schema = data.schema
  }

  try {
    return await http.post('/schemas', body)
  } catch (error) {
    console.error(error)
    return false
  }
}

export default {}
