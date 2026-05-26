import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import ForceGraph2D from 'react-force-graph-2d'
import styles from './GNNGraphPanel.module.css'

// Generate realistic mock data for the GNN
const generateMockData = () => {
  const nodes = []
  const links = []
  
  // 1. Grupos (Estructuras comunitarias)
  const groupTopics = [
    { name: 'Apoyo Legal', lang: 'ES/AR' },
    { name: 'Intercambio Ropa', lang: 'ES/CA' },
    { name: 'Maternidad', lang: 'ES/EN' },
    { name: 'Vivienda', lang: 'ES' },
    { name: 'Clases Idiomas', lang: 'ES/FR' }
  ]
  
  groupTopics.forEach((topic, idx) => {
    nodes.push({ 
      id: `group-${idx}`, 
      groupType: 'grupo', 
      label: `Grupo: ${topic.name}`, 
      val: 8,
      topic: topic.name,
      language: topic.lang
    })
  })

  // 2. Helpers (Institucionales/ONGs)
  const ongs = ['Cruz Roja', 'Cáritas', 'Fundación Madrina', 'Save the Children', 'CEAR']
  const domains = ['Asesoría Legal', 'Salud Mental', 'Apoyo Infantil', 'Vivienda', 'Empleo']
  
  for (let i = 0; i < 15; i++) {
    const id = `helper-${i}`
    const ong = ongs[Math.floor(Math.random() * ongs.length)]
    const domain = domains[Math.floor(Math.random() * domains.length)]
    
    nodes.push({
      id,
      groupType: 'helper',
      label: `Helper: ${ong}`,
      val: 5,
      ong,
      domain
    })

    // Helpers se afilian a 1-2 grupos
    const numGroups = Math.floor(Math.random() * 2) + 1
    for (let c = 0; c < numGroups; c++) {
      const randomGroup = Math.floor(Math.random() * groupTopics.length)
      links.push({ 
        source: id, 
        target: `group-${randomGroup}`, 
        edgeType: 'afiliacion',
        value: 2 
      })
    }
  }

  // 3. Usuarios (Usuarias)
  for (let i = 0; i < 120; i++) {
    const id = `user-${i}`
    const needsActive = Math.floor(Math.random() * 3)
    const needsResolved = Math.floor(Math.random() * 5)
    const willingnessToHelp = Math.floor(Math.random() * 100) + '%'
    
    nodes.push({
      id,
      groupType: 'usuario',
      label: `Usuaria ${i}`,
      val: 3,
      needsActive,
      needsResolved,
      willingnessToHelp
    })

    // Usuarios se afilian a 1-3 grupos
    const numGroups = Math.floor(Math.random() * 3) + 1
    for (let c = 0; c < numGroups; c++) {
      const randomGroup = Math.floor(Math.random() * groupTopics.length)
      links.push({ 
        source: id, 
        target: `group-${randomGroup}`, 
        edgeType: 'afiliacion',
        value: 1 
      })
    }

    // Interacciones entre usuarios (mensajes)
    if (Math.random() > 0.7) {
      const randomUser = Math.floor(Math.random() * 120)
      if (randomUser !== i) {
        links.push({ 
          source: id, 
          target: `user-${randomUser}`, 
          edgeType: 'interaccion',
          interactionType: 'Mensaje Directo',
          value: 1 
        })
      }
    }

    // Interacciones de usuarios con helpers (asistencia a evento / consulta)
    if (Math.random() > 0.5) {
      const randomHelper = Math.floor(Math.random() * 15)
      links.push({ 
        source: id, 
        target: `helper-${randomHelper}`, 
        edgeType: 'interaccion',
        interactionType: Math.random() > 0.5 ? 'Asistencia a evento' : 'Consulta',
        value: 1 
      })
    }
  }

  return { nodes, links }
}

export default function GNNGraphPanel() {
  const graphRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const graphData = useMemo(() => generateMockData(), [])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    
    window.addEventListener('resize', handleResize)
    // Small delay to ensure parent has rendered to full flex height
    setTimeout(handleResize, 100)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-200)
      graphRef.current.d3Force('link').distance(60)
    }
  }, [dimensions]) // Re-apply if dimensions change

  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom()
      graphRef.current.zoom(currentZoom * 1.5, 400)
    }
  }

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom()
      graphRef.current.zoom(currentZoom / 1.5, 400)
    }
  }

  const handleFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 40)
    }
  }

  const getNodeColor = (node) => {
    switch (node.groupType) {
      case 'grupo': return '#3D405B' // Dark Blue
      case 'helper': return '#81B29A' // Green
      case 'usuario': return '#E07A5F' // Orange
      default: return '#cccccc'
    }
  }

  const getTooltipHTML = (node) => {
    if (node.groupType === 'usuario') {
      return `
        <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif; color: #333; border: 1px solid #ddd;">
          <h4 style="margin: 0 0 8px 0; color: #E07A5F;">👤 ${node.label}</h4>
          <div style="font-size: 13px; line-height: 1.5;">
            <strong>Necesidades activas:</strong> ${node.needsActive}<br/>
            <strong>Necesidades resueltas:</strong> ${node.needsResolved}<br/>
            <strong>Disposición a ayudar:</strong> ${node.willingnessToHelp}
          </div>
        </div>
      `
    } else if (node.groupType === 'helper') {
      return `
        <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif; color: #333; border: 1px solid #ddd;">
          <h4 style="margin: 0 0 8px 0; color: #81B29A;">⛑️ Helper</h4>
          <div style="font-size: 13px; line-height: 1.5;">
            <strong>Organización:</strong> ${node.ong}<br/>
            <strong>Dominio:</strong> ${node.domain}
          </div>
        </div>
      `
    } else if (node.groupType === 'grupo') {
      return `
        <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif; color: #333; border: 1px solid #ddd;">
          <h4 style="margin: 0 0 8px 0; color: #3D405B;">👥 Grupo Comunitario</h4>
          <div style="font-size: 13px; line-height: 1.5;">
            <strong>Tema:</strong> ${node.topic}<br/>
            <strong>Idioma(s):</strong> ${node.language}
          </div>
        </div>
      `
    }
    return node.label
  }

  const getEdgeTooltipHTML = (link) => {
    return `
      <div style="background: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-family: sans-serif; color: #333; font-size: 12px; border: 1px solid #ddd;">
        <strong>Tipo:</strong> ${link.edgeType === 'afiliacion' ? 'Afiliación (Membresía)' : 'Interacción'}<br/>
        ${link.interactionType ? `<strong>Detalle:</strong> ${link.interactionType}` : ''}
      </div>
    `
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <Network size={28} color="var(--color-primary)" />
          <h1 className={styles.title}>Visualización GNN</h1>
        </div>
        <p className={styles.subtitle}>
          Mapa interactivo de la red comunitaria. Explora afiliaciones continuas e interacciones dinámicas.
        </p>
      </header>

      <div className={styles.graphWrapper} ref={containerRef}>
        <div className={styles.toolbar}>
          <button className={styles.toolBtn} onClick={handleZoomIn} title="Acercar">
            <ZoomIn size={18} />
          </button>
          <button className={styles.toolBtn} onClick={handleZoomOut} title="Alejar">
            <ZoomOut size={18} />
          </button>
          <button className={styles.toolBtn} onClick={handleFit} title="Centrar">
            <Maximize size={18} />
          </button>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.colorDot} style={{ backgroundColor: '#E07A5F' }} /> Usuarias (Ayuda / Dar ayuda)
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorDot} style={{ backgroundColor: '#81B29A' }} /> Helpers (ONGs / Verificados)
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorDot} style={{ backgroundColor: '#3D405B', borderRadius: '4px' }} /> Grupos (Comunidad)
          </div>
          <div style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
             <div className={styles.legendItem} style={{ marginBottom: '4px' }}>
                <span style={{ display: 'inline-block', width: '20px', height: '2px', backgroundColor: '#aaa' }} /> Afiliación
             </div>
             <div className={styles.legendItem}>
                <span style={{ display: 'inline-block', width: '20px', height: '2px', borderBottom: '2px dashed #aaa' }} /> Interacción
             </div>
          </div>
        </div>

        {dimensions.width > 0 && dimensions.height > 0 && (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel={getTooltipHTML}
            linkLabel={getEdgeTooltipHTML}
            nodeColor={getNodeColor}
            nodeRelSize={4}
            // Diferenciamos formas de los nodos. Grupos serán cuadrados.
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.label
              const fontSize = 12/globalScale
              ctx.font = `${fontSize}px Sans-Serif`
              const textWidth = ctx.measureText(label).width
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2)

              ctx.fillStyle = getNodeColor(node)
              
              if (node.groupType === 'grupo') {
                const size = node.val * 2
                ctx.fillRect(node.x - size/2, node.y - size/2, size, size)
              } else {
                ctx.beginPath()
                ctx.arc(node.x, node.y, node.val * 1.5, 0, 2 * Math.PI, false)
                ctx.fill()
              }
            }}
            linkColor={(link) => link.edgeType === 'afiliacion' ? '#999999' : '#cccccc'}
            linkWidth={(link) => link.edgeType === 'afiliacion' ? 1.5 : 1}
            linkLineDash={(link) => link.edgeType === 'interaccion' ? [4, 4] : null}
            backgroundColor="var(--color-surface)"
            cooldownTicks={100}
          />
        )}
      </div>
    </motion.div>
  )
}
