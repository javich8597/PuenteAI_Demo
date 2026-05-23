import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import ForceGraph2D from 'react-force-graph-2d'
import { Info, User, Building, Users } from 'lucide-react'
import styles from './RecommendationsPage.module.css'
import useNetworkStore from '../../store/useNetworkStore'

export default function RecommendationsPage() {
  const { nodes, links, selectedNode, selectNode, clearSelection } = useNetworkStore()
  const fgRef = useRef()
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight - 150 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth < 480 ? window.innerWidth : 480,
        height: window.innerHeight - 150
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getNodeColor = (node) => {
    if (node.id === 'me') return '#E07A5F' // Coral
    if (node.ring === 1) return '#81B29A' // Sage Green
    return '#F2CC8F' // Amber for ring 2 (GNN suggestions)
  }

  const paintNode = (node, ctx, globalScale) => {
    const { x, y } = node
    const isSelected = selectedNode === node.id
    const size = node.id === 'me' ? 8 : (node.ring === 1 ? 6 : 5)
    
    // Draw outer glow/selection ring
    if (isSelected || node.id === 'me') {
      ctx.beginPath()
      ctx.arc(x, y, size + 3, 0, 2 * Math.PI, false)
      ctx.fillStyle = node.id === 'me' ? 'rgba(224, 122, 95, 0.3)' : 'rgba(129, 178, 154, 0.3)'
      ctx.fill()
    }

    // Draw main circle
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI, false)
    ctx.fillStyle = getNodeColor(node)
    ctx.fill()

    // Draw stroke
    ctx.lineWidth = isSelected ? 1.5 : 0.5
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()

    // Text label
    if (globalScale > 1.5 || node.id === 'me' || isSelected) {
      const label = node.name
      const fontSize = 12 / globalScale
      ctx.font = `${fontSize}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#3D405B'
      ctx.fillText(label, x, y + size + 4 + fontSize)
    }
  }

  const paintLink = (link, ctx) => {
    ctx.beginPath()
    ctx.moveTo(link.source.x, link.source.y)
    ctx.lineTo(link.target.x, link.target.y)
    
    ctx.lineWidth = link.strength || 1
    
    // GNN recommendations (ring 2) get dashed lines
    if (link.target.ring === 2 || link.source.ring === 2) {
      ctx.setLineDash([2, 2])
      ctx.strokeStyle = 'rgba(242, 204, 143, 0.6)'
    } else {
      ctx.setLineDash([])
      ctx.strokeStyle = 'rgba(129, 178, 154, 0.4)'
    }
    
    ctx.stroke()
  }

  const getIcon = (type) => {
    switch(type) {
      case 'institution': return <Building size={16} />
      case 'group': return <Users size={16} />
      default: return <User size={16} />
    }
  }

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Tu Red (Ego-Network)</h1>
        <p className={styles.subtitle}>Conexiones sugeridas por el motor GNN</p>
      </div>

      <div className={styles.graphContainer}>
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={{ nodes, links }}
          nodeCanvasObject={paintNode}
          linkCanvasObject={paintLink}
          onNodeClick={(node) => {
            selectNode(node.id)
            if (fgRef.current) {
              fgRef.current.centerAt(node.x, node.y, 1000)
              fgRef.current.zoom(2.5, 1000)
            }
          }}
          onBackgroundClick={() => {
            clearSelection()
            if (fgRef.current) {
              fgRef.current.zoomToFit(1000, 50)
            }
          }}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          backgroundColor="#FAFAF8"
        />
        
        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ backgroundColor: '#E07A5F' }}></span>
            <span>Tú</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ backgroundColor: '#81B29A' }}></span>
            <span>Conexiones actuales (R1)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ backgroundColor: '#F2CC8F' }}></span>
            <span>Sugerencias GNN (R2)</span>
          </div>
        </div>
      </div>

      {/* Selected Node Bottom Sheet */}
      {selectedNodeData && selectedNodeData.id !== 'me' && (
        <motion.div 
          className={styles.bottomSheet}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className={styles.sheetHandle}></div>
          <div className={styles.sheetHeader}>
            <div className={styles.nodeAvatar} style={{ backgroundColor: getNodeColor(selectedNodeData) }}>
              {getIcon(selectedNodeData.type)}
            </div>
            <div className={styles.nodeInfo}>
              <h3 className={styles.nodeName}>{selectedNodeData.name}</h3>
              <p className={styles.nodeType}>
                {selectedNodeData.type === 'institution' ? 'Institución verificada' : 
                 selectedNodeData.type === 'group' ? 'Grupo comunitario' : 'Mamá de la comunidad'}
              </p>
            </div>
            {selectedNodeData.trustScore && (
              <div className={styles.trustScore}>
                <span>{selectedNodeData.trustScore}%</span>
                <span className={styles.trustLabel}>Afinidad</span>
              </div>
            )}
          </div>
          
          <div className={styles.sheetBody}>
            {selectedNodeData.ring === 2 && (
              <div className={styles.gnnReason}>
                <Info size={16} />
                <p>Nuestra IA te sugiere conectar porque tienen intereses en común en <strong>Vivienda</strong> y <strong>Educación</strong>.</p>
              </div>
            )}
            
            <button className={styles.connectBtn}>
              {selectedNodeData.type === 'user' ? 'Enviar mensaje' : 
               selectedNodeData.type === 'group' ? 'Unirse al grupo' : 'Ver información'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
