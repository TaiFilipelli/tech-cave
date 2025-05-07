import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef } from 'react'

export default function HeroSection(){
  return (
    <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
            <ParticleBackground />
        </div>
        <section className="relative z-10 flex flex-col text-center items-center justify-center h-full">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-600 text-sm font-medium mb-4">Bienvenido a {`Tech's Cave`}</span>
            <span className='block text-6xl font-bold'>Lleva tu PC</span>
            <span className='block text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-500'>al siguiente nivel</span>
            <p className='mt-5 text-xl'>Sea tu herramienta de trabajo, tu espacio seguro, tu hobby o tu amante.  <br />Tu PC merece dar un paso más. Acá encontras todo lo que necesitas</p>
            <div className='absolute bottom-5'>
                <FontAwesomeIcon icon={faArrowDown} bounce size='2xl' color='#7c3aed'/>
            </div>
        </section>
  </div>
  )
}
function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
  
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
  
      const ctx = canvas.getContext("2d")
      if (!ctx) return
  
      let animationFrameId: number
  
      // Set canvas dimensions
      const setCanvasDimensions = () => {
        if (!canvas) return
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
  
      setCanvasDimensions()
      window.addEventListener("resize", setCanvasDimensions)
  
      // Particle properties
      const particlesArray: Particle[] = []
      const numberOfParticles = 100
  
      class Particle {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string
  
        constructor() {
          this.x = Math.random() * canvas!.width
          this.y = Math.random() * canvas!.height
          this.size = Math.random() * 3 + 1
          this.speedX = (Math.random() - 0.5) * 0.5
          this.speedY = (Math.random() - 0.5) * 0.5
          this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 150) + 100}, ${Math.random() * 0.5 + 0.3})`
        }
  
        update() {
          this.x += this.speedX
          this.y += this.speedY
  
          if (this.x > canvas!.width) this.x = 0
          else if (this.x < 0) this.x = canvas!.width
  
          if (this.y > canvas!.height) this.y = 0
          else if (this.y < 0) this.y = canvas!.height
        }
  
        draw() {
          if (!ctx) return
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
  
      const init = () => {
        for (let i = 0; i < numberOfParticles; i++) {
          particlesArray.push(new Particle())
        }
      }
  
      const connectParticles = () => {
        if (!ctx) return
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x
            const dy = particlesArray[a].y - particlesArray[b].y
            const distance = Math.sqrt(dx * dx + dy * dy)
  
            if (distance < 100) {
              const opacity = 1 - distance / 100
              ctx.strokeStyle = `rgba(150, 100, 200, ${opacity * 0.4})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
              ctx.stroke()
            }
          }
        }
      }
  
      const animate = () => {
        if (!ctx || !canvas) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
  
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update()
          particlesArray[i].draw()
        }
  
        connectParticles()
        animationFrameId = requestAnimationFrame(animate)
      }
  
      init()
      animate()
  
      return () => {
        window.removeEventListener("resize", setCanvasDimensions)
        cancelAnimationFrame(animationFrameId)
      }
    }, [])
  
    return <canvas ref={canvasRef} className="absolute inset-0 bg-gray-200 dark:bg-black"/>
  }