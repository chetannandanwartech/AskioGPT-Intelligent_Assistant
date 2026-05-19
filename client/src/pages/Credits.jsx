import React, { useEffect } from 'react'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    setPlans(dummyPlans)
    setLoading(false)
  }

  useEffect(()=>{
    fetchPlans()
  },[])

  if(loading) return <Loading />

  return (
    <div className=''>
      
    </div>
  )
}

export default Credits
