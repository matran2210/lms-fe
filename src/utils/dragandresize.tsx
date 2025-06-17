export const moveAndResizeElement = (
  element: HTMLElement,
  callback: ({
    left,
    top,
    width,
    height,
  }: {
    top: string
    left: string
    width: string
    height: string
  }) => void,
  not_resizable?: boolean,
) => {
  let mousePosition = { x: 0, y: 0 }
  let offset: [number, number] = [0, 0]
  let isDown = false
  let currentResizer: string | null = null
  let original_width = 0
  let original_height = 0
  let original_x = 0
  let original_y = 0
  let original_mouse_x = 0
  let original_mouse_y = 0
  const minimum_size = 20
  let enable = false

  const getClientX = (e: MouseEvent | TouchEvent) =>
    'touches' in e ? e.touches[0].clientX : e.clientX

  const getClientY = (e: MouseEvent | TouchEvent) =>
    'touches' in e ? e.touches[0].clientY : e.clientY

  const getPageX = (e: MouseEvent | TouchEvent) =>
    'touches' in e ? e.touches[0].pageX : e.pageX

  const getPageY = (e: MouseEvent | TouchEvent) =>
    'touches' in e ? e.touches[0].pageY : e.pageY

  function handleDoubleClick(e: MouseEvent) {
    if (!not_resizable) {
      enable = true
      const resizable = document.body.querySelectorAll('.resizable.enable')
      resizable.forEach((e) => e.classList.remove('enable'))

      let target = e.target as HTMLElement
      if (!target.classList.contains('resizable')) {
        target = target.closest('.resizable') as HTMLElement
      }
      if (target) {
        target.classList.add('enable')
      }
    }
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    if (!isDown) return
    e.preventDefault()

    mousePosition = {
      x: getClientX(e),
      y: getClientY(e),
    }

    if (!currentResizer) {
      element.style.left = mousePosition.x + offset[0] + 'px'
      element.style.top = mousePosition.y + offset[1] + 'px'
      return
    }

    const dx = getPageX(e) - original_mouse_x
    const dy = getPageY(e) - original_mouse_y

    switch (currentResizer) {
      case 'bottom-right':
        {
          const width = original_width + dx
          const height = original_height + dy
          if (width > minimum_size) element.style.width = width + 'px'
          if (height > minimum_size) element.style.height = height + 'px'
        }
        break
      case 'bottom-left':
        {
          const width = original_width - dx
          const height = original_height + dy
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + dx + 'px'
          }
          if (height > minimum_size) element.style.height = height + 'px'
        }
        break
      case 'top-right':
        {
          const width = original_width + dx
          const height = original_height - dy
          if (width > minimum_size) element.style.width = width + 'px'
          if (height > minimum_size) {
            element.style.height = height + 'px'
            element.style.top = original_y + dy + 'px'
          }
        }
        break
      case 'top-left':
        {
          const width = original_width - dx
          const height = original_height - dy
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + dx + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
            element.style.top = original_y + dy + 'px'
          }
        }
        break
      case 'right':
        {
          const width = original_width + dx
          if (width > minimum_size) element.style.width = width + 'px'
        }
        break
      case 'left':
        {
          const width = original_width - dx
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + dx + 'px'
          }
        }
        break
    }
  }

  const startMove = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement | null
    if (!target?.closest('.not-resizer')) {
      isDown = true
      offset = [
        element.offsetLeft - getClientX(e),
        element.offsetTop - getClientY(e),
      ]

      if (target && target.classList && target.classList.contains('resizer')) {
        currentResizer = target.classList[1] || ''
        original_width = parseFloat(getComputedStyle(element).width)
        original_height = parseFloat(getComputedStyle(element).height)
        original_x = element.getBoundingClientRect().left
        original_y = element.getBoundingClientRect().top
        original_mouse_x = getPageX(e)
        original_mouse_y = getPageY(e)
      }

      document.addEventListener('mousemove', handleMove, true)
      document.addEventListener('touchmove', handleMove, { passive: false })
    }
  }

  const endMove = () => {
    document.removeEventListener('mousemove', handleMove, true)
    document.removeEventListener('touchmove', handleMove)

    isDown = false
    currentResizer = null

    if (element.classList.contains('enable')) {
      callback({
        top: element.style.top,
        left: element.style.left,
        width: element.style.width,
        height: element.style.height,
      })
    }
  }

  element.addEventListener('dblclick', handleDoubleClick)
  element.addEventListener('click', function (e: MouseEvent) {
    if (enable && !(e.target as HTMLElement).closest('.resizers')) {
      enable = false
      const resizable = document.body.querySelectorAll('.resizable.enable')
      resizable.forEach((e) => e.classList.remove('enable'))
    }
  })

  element.addEventListener('mousedown', startMove, true)
  element.addEventListener('touchstart', startMove, { passive: false })

  element.addEventListener('mouseup', endMove, true)
  element.addEventListener('touchend', endMove)
}
