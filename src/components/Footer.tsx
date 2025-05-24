import React from 'react'

const Footer = () => {
  return (
    <footer className="dark:bg-gray-900 dark:text-white bg-gray-400 text-black p-10">
      <div className="container mx-auto flex flex-col items-center justify-center py-10 px-5">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Tech Cave. Todos los derechos reservados.
        </p>
      </div>
      
    </footer>
  )
}

export default Footer
