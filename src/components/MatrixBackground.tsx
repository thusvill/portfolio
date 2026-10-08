import type { CSSProperties } from 'react'

const streams = [
  { left: 5, duration: 34, delay: 19, code: '010110010011010101101001' },
  { left: 18, duration: 41, delay: 8, code: '101001101010010110010101' },
  { left: 32, duration: 37, delay: 27, code: '001101011001011010100101' },
  { left: 49, duration: 43, delay: 14, code: '110100101101001011010010' },
  { left: 66, duration: 32, delay: 24, code: '011010010110100101101001' },
  { left: 81, duration: 39, delay: 5, code: '100101101001011010010110' },
  { left: 94, duration: 45, delay: 31, code: '010010110100101101001011' },
]

function MatrixBackground() {
  return (
    <div className="matrix-background" aria-hidden="true">
      {streams.map((stream) => (
        <span
          className="matrix-column"
          key={stream.left}
          style={{
            left: `${stream.left}%`,
            '--matrix-duration': `${stream.duration}s`,
            '--matrix-delay': `-${stream.delay}s`,
          } as CSSProperties}
        >
          {stream.code.repeat(5)}
        </span>
      ))}
    </div>
  )
}

export default MatrixBackground
