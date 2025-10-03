"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// SrvcFlo themed logo PNGs - you can customize these URLs to match your brand
const logoPngs = [
  "https://dexscreener.com/favicon.png",
  "https://dd.dexscreener.com/ds-data/dexes/shadow-exchange.png",
  "https://dd.dexscreener.com/ds-data/dexes/wagmi.png",
  "https://dd.dexscreener.com/ds-data/dexes/metropolis.png",
  "https://dd.dexscreener.com/ds-data/dexes/beets.png",
  "https://dd.dexscreener.com/ds-data/dexes/equalizer.png",
  "https://dd.dexscreener.com/ds-data/dexes/fat-finger.png",
  "https://dd.dexscreener.com/ds-data/dexes/spookyswap.png",
  "https://dd.dexscreener.com/ds-data/dexes/defive.png",
  "https://dd.dexscreener.com/ds-data/dexes/zkswap.png",
  "https://dd.dexscreener.com/ds-data/dexes/sonic-market.png",
  "https://dd.dexscreener.com/ds-data/dexes/sonic-swap.png",
  "https://dd.dexscreener.com/ds-data/dexes/fat-finger.png",
  "https://media-paint.paintswap.finance/0x8500d84b203775fc8b418148223872b35c43b050-146-1734986837_thumb.png",
  "https://media-paint.paintswap.finance/0xc83f364827b9f0d7b27a9c48b2419e4a14e72f78-146-1735942291_thumb.png",
  "https://media-paint.paintswap.finance/0x5d5bde4b25e43b32d6571bc630f0a6b11216b490-146-1754139071_thumb.png",
  "https://media-paint.paintswap.finance/0xf20bd8b3a20a6d9884121d7a6e37a95a810183e2-146-1737630183_thumb.png",
  "https://media-paint.paintswap.finance/0x6754e351b719a7119e67bb84cffa2d9949887ea5-146-1738877229_thumb.png",
  "https://media-paint.paintswap.finance/0x17dc8a808cedbc46e33df745d2f7ea9f896668d2-146-1750864839_thumb.png",
  "https://media-paint.paintswap.finance/0x6e3af0e31f48e878d89125c76de37fcdb539d57a-146-1741290862_thumb.png",
  "https://media-paint.paintswap.finance/0x3c02968a8b851ed2bebb27f421a328ee1de2939f-146-1745938037_thumb.png",
  "https://media-paint.paintswap.finance/0x6872967f1baae03fdbbed840088486e9a7c10e40-146-1735032920_thumb.png",
  "https://media-paint.paintswap.finance/0x83c27147f0aa26b153de120f600d0238ef7a4ebb-146-1740333134_thumb.png",
  "https://media-paint.paintswap.finance/0x0dd93c18b9c4247265fafe1c99cec247186a2e03_thumb_v3.png",
  "/images/openocean-icon.png",
  "/images/paintswap.png",
  "https://dd.dexscreener.com/ds-data/tokens/sonic/0xe51ee9868c1f0d6cd968a8b8c8376dc2991bfe44.png?key=50f8b4",
  "https://dd.dexscreener.com/ds-data/tokens/sonic/0x9fdbc3f8abc05fa8f3ad3c17d2f806c1230c4564.png?size=lg&key=c9601a",
  "https://dd.dexscreener.com/ds-data/tokens/sonic/0xb098afc30fce67f1926e735db6fdadfe433e61db.png?key=430ae8",
]

interface Drop {
  x: number
  y: number
  speed: number
  size: number
  img: HTMLImageElement
  z: "behind" | "above"
}

function getRandomLogoImage(images: HTMLImageElement[]) {
  return images[Math.floor(Math.random() * images.length)]
}

function createDrop(width: number, height: number, images: HTMLImageElement[]): Drop {
  return {
    x: Math.random() * width,
    y: Math.random() * -height,
    speed: Math.random() * 2 + 1.5,
    size: Math.random() * 32 + 24,
    img: getRandomLogoImage(images),
    z: Math.random() < 0.9 ? "behind" : "above",
  }
}

function useLogoRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const dropsRef = useRef<Drop[]>([])
  const imagesRef = useRef<HTMLImageElement[]>([])
  const animationRef = useRef<number>(0)

  // Load all images once
  useEffect(() => {
    let loaded = 0
    const imgs: HTMLImageElement[] = []
    logoPngs.forEach((src) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        loaded++
        if (loaded === logoPngs.length) {
          imagesRef.current = imgs
          initializeDrops()
        }
      }
      imgs.push(img)
    })
    // eslint-disable-next-line
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        canvasRef.current.width = width
        canvasRef.current.height = height
        setDimensions({ width, height })
        initializeDrops()
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
    // eslint-disable-next-line
  }, [])

  // Initialize drops
  function initializeDrops() {
    if (!imagesRef.current.length) return
    const width = window.innerWidth
    const height = window.innerHeight
    const dropCount = Math.floor((width * height) / 1200) // density
    const drops: Drop[] = []
    for (let i = 0; i < dropCount; i++) {
      drops.push(createDrop(width, height, imagesRef.current))
    }
    dropsRef.current = drops
  }

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    function drawDrops(z: "behind" | "above") {
      if (!ctx) return
      dropsRef.current.forEach((drop) => {
        if (drop.z !== z) return
        if (drop.img.complete) {
          ctx.globalAlpha = z === "behind" ? 0.18 : 0.5
          ctx.drawImage(drop.img, drop.x, drop.y, drop.size, drop.size)
        }
      })
      ctx.globalAlpha = 1
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      drawDrops("behind")
      // Ghosting/foreground is handled by React below
      drawDrops("above")
      dropsRef.current.forEach((drop, i) => {
        drop.y += drop.speed
        if (drop.y > dimensions.height) {
          dropsRef.current[i] = createDrop(dimensions.width, dimensions.height, imagesRef.current)
        }
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationRef.current)
    // eslint-disable-next-line
  }, [dimensions])

  return canvasRef
}

export default function BackgroundPaths({
  title = "Background Paths",
  onEnter,
}: {
  title?: string
  onEnter?: () => void
}) {
  const canvasRef = useLogoRain()
  const words = title.split(" ")

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Rainfall canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        aria-label="Logo rainfall animation"
      />

      {/* Ghosting/foreground content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text
                                        bg-gradient-to-r from-white to-white/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div
            className="inline-block group relative bg-gradient-to-b from-white/10 to-white/5
                        p-px rounded-2xl backdrop-blur-lg
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Button
              variant="ghost"
              onClick={onEnter}
              className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md
                            bg-white/10 hover:bg-white/20
                            text-white transition-all duration-300
                            group-hover:-translate-y-0.5 border border-white/20
                            hover:shadow-md hover:shadow-white/10"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">Enter serviceflow.com</span>
              <span
                className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5
                                transition-all duration-300"
              >
                →
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
