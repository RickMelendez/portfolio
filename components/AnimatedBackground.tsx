import type React from "react"

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${-Math.random() * 20}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default AnimatedBackground

