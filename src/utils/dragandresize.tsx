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
) => {
  let mousePosition: { x: number; y: number }
  let offset: [number, number] = [0, 0]
  let isDown = false
  let currentResizer: string | null
  let original_width: number
  let original_height: number
  let original_x: number
  let original_y: number
  let original_mouse_x: number
  let original_mouse_y: number
  const minimum_size = 20

  let enable = false

  function handleDoubleClick(e: MouseEvent) {
    enable = true
    const resizable = document.body.querySelectorAll('.resizable.enable')
    resizable.forEach((e) => {
      e.classList.remove('enable')
    })
    let target = e.target as HTMLDivElement
    if (!target.classList.contains('resizable')) {
      target = target.closest('.resizable') as HTMLDivElement
    }
    target.classList.add('enable')
  }
  function handleMoveMouse(e: MouseEvent) {
    // if (!enable) {
    //   return
    // }
    e.preventDefault()
    if (isDown) {
      mousePosition = {
        x: e.clientX,
        y: e.clientY,
      }
      if (!currentResizer) {
        element.style.left = mousePosition.x + offset[0] + 'px'
        element.style.top = mousePosition.y + offset[1] + 'px'
        return
      }

      switch (currentResizer) {
        case 'bottom-right':
          {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height + (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
            }
          }
          break
        case 'bottom-left':
          {
            const height = original_height + (e.pageY - original_mouse_y)
            const width = original_width - (e.pageX - original_mouse_x)
            if (height > minimum_size) {
              element.style.height = height + 'px'
            }
            if (width > minimum_size) {
              element.style.width = width + 'px'
              element.style.left =
                original_x + (e.pageX - original_mouse_x) + 'px'
            }
          }
          break
        case 'top-right':
          {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
              element.style.top =
                original_y + (e.pageY - original_mouse_y) + 'px'
            }
          }
          break
        case 'top-left':
          {
            const width = original_width - (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
              element.style.left =
                original_x + (e.pageX - original_mouse_x) + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
              element.style.top =
                original_y + (e.pageY - original_mouse_y) + 'px'
            }
          }
          break
        case 'right':
          {
            const width = original_width + (e.pageX - original_mouse_x)
            if (width > minimum_size) {
              element.style.width = width + 'px'
            }
          }
          break
        case 'left':
          {
            const width = original_width - (e.pageX - original_mouse_x)
            if (width > minimum_size) {
              element.style.width = width + 'px'
              element.style.left =
                original_x + (e.pageX - original_mouse_x) + 'px'
            }
          }
          break
        default:
          break
      }
    }
  }
  element.addEventListener('dblclick', (e) => handleDoubleClick(e))

  element.addEventListener('click', function (e: MouseEvent) {
    if (enable && !(e.target as HTMLElement).closest('.resizers')) {
      enable = false
      const resizable = document.body.querySelectorAll('.resizable.enable')
      resizable.forEach((e) => {
        e.classList.remove('enable')
      })
    }
  })

  element.addEventListener(
    'mousedown',
    function (e: MouseEvent) {
      document.addEventListener('mousemove', handleMoveMouse, true)
      isDown = true
      offset = [element.offsetLeft - e.clientX, element.offsetTop - e.clientY]
      if ((e.target as HTMLElement).classList.contains('resizer')) {
        currentResizer = (e.target as HTMLElement)?.classList[1]
        original_width = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue('width')
            .replace('px', ''),
        )
        original_height = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue('height')
            .replace('px', ''),
        )
        original_x = element.getBoundingClientRect().left
        original_y = element.getBoundingClientRect().top
        original_mouse_x = e.pageX
        original_mouse_y = e.pageY
      }
    },
    true,
  )
  element.addEventListener(
    'mouseup',
    function () {
      document.removeEventListener('mousemove', handleMoveMouse, true)
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
    },
    true,
  )
}
