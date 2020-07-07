import { useEffect, useState } from 'react'

export const useStatisticsAPI = (reportType, orgId, timeframe) => {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    setLoading(true)
    global.fetch(`/api/statistics/${reportType}/${orgId}/${timeframe}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error()
        }
        setError(undefined)
        return res.json()
      })
      .then((data) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [orgId, timeframe, reportType])

  return { data, error, loading }
}
