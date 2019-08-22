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
  const body = {
    name: data.name,
    description: data.description,
    parser_type: data.parser_type,
  }
  if (data.parser_type === '3rd-party') {
    body.parser_addr = data.parser_addr
    body.parser_opts = {
      '3rd_party_opts': data['3rd_party_opts'],
      connect_timeout: data.connect_timeout,
      parser_timeout: data.parser_timeout,
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
