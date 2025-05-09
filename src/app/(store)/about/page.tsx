import { faPoo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const AboutPage = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-200">
        <h1 className='text-2xl'>Página en construcción</h1>
        <h2 className='text-xl mb-16'>Esta página estará disponible pronto. Miralo a Tommy trabajar mientras</h2>
      <FontAwesomeIcon icon={faPoo} size='6x' className='text-violet-600' bounce/>
    </section>
  )
}

export default AboutPage