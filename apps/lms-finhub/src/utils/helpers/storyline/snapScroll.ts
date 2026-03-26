let isSnapping = false
let snapTimeout: any = null

export function enableSnapScroll(getSnapPoints: () => number[], offset = 80) {
  function onScroll() {
    if (isSnapping) return

    clearTimeout(snapTimeout)

    snapTimeout = setTimeout(() => {
      const scrollY = window.scrollY
      const points = getSnapPoints()

      if (!points.length) return

      // tìm snap point gần nhất
      let closest = points[0]
      let minDist = Math.abs(scrollY - points[0])

      for (const p of points) {
        const d = Math.abs(scrollY - p)
        if (d < minDist) {
          minDist = d
          closest = p
        }
      }

      // threshold để tránh giật
      if (minDist < 40) return

      isSnapping = true
      window.scrollTo({
        top: closest - offset,
        behavior: 'smooth',
      })

      setTimeout(() => {
        isSnapping = false
      }, 500)
    }, 120)
  }

  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', onScroll)
    clearTimeout(snapTimeout)
  }
}
