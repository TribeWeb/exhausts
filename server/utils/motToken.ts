interface MotTokenResponse {
  token_type: 'Bearer'
  expires_in: number
  ext_expires_in: number
  access_token: string
}

const { motApiClientId, motApiClientSecret, motApiTokenUrl } = useRuntimeConfig()

export const cachedMotToken = defineCachedFunction(async () => {
  const data = await $fetch<MotTokenResponse>(`https://login.microsoftonline.com/${motApiTokenUrl}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&client_id=${motApiClientId}&client_secret=${motApiClientSecret}&scope=https://tapi.dvsa.gov.uk/.default`
  })

  return data.access_token
}, {
  maxAge: 60 * 60,
  name: 'motToken',
  getKey: () => 'motToken'
})
