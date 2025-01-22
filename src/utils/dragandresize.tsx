import { BASE_FONT_SIZE } from './constants'

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
    if (!not_resizable) {
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
  }
  const movablezone = element.querySelector('.sapp-movablezone') as any
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
        element.style.left =
          (mousePosition.x + offset[0]) / BASE_FONT_SIZE + 'rem'
        element.style.top =
          (mousePosition.y + offset[1]) / BASE_FONT_SIZE + 'rem'
        return
      }

      switch (currentResizer) {
        case 'bottom-right':
          {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height + (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width / BASE_FONT_SIZE + 'rem'
            }
            if (height > minimum_size) {
              element.style.height = height / BASE_FONT_SIZE + 'rem'
            }
          }
          break
        case 'bottom-left':
          {
            const height = original_height + (e.pageY - original_mouse_y)
            const width = original_width - (e.pageX - original_mouse_x)
            if (height > minimum_size) {
              element.style.height = height / BASE_FONT_SIZE + 'rem'
            }
            if (width > minimum_size) {
              element.style.width = width / BASE_FONT_SIZE + 'rem'
              element.style.left =
                (original_x + (e.pageX - original_mouse_x)) / BASE_FONT_SIZE +
                'rem'
            }
          }
          break
        case 'top-right':
          {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width / BASE_FONT_SIZE + 'rem'
            }
            if (height > minimum_size) {
              element.style.height = height / BASE_FONT_SIZE + 'rem'
              element.style.top =
                (original_y + (e.pageY - original_mouse_y)) / BASE_FONT_SIZE +
                'rem'
            }
          }
          break
        case 'top-left':
          {
            const width = original_width - (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width / BASE_FONT_SIZE + 'rem'
              element.style.left =
                (original_x + (e.pageX - original_mouse_x)) / BASE_FONT_SIZE +
                'rem'
            }
            if (height > minimum_size) {
              element.style.height = height / BASE_FONT_SIZE + 'rem'
              element.style.top =
                original_y + (e.pageY - original_mouse_y) + 'rem'
            }
          }
          break
        case 'right':
          {
            const width = original_width + (e.pageX - original_mouse_x)
            if (width > minimum_size) {
              element.style.width = width / BASE_FONT_SIZE + 'rem'
            }
          }
          break
        case 'left':
          {
            const width = original_width - (e.pageX - original_mouse_x)
            if (width > minimum_size) {
              element.style.width = width / BASE_FONT_SIZE + 'rem'
              element.style.left =
                original_x + (e.pageX - original_mouse_x) + 'rem'
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

  // movablezone?.addEventListener(
  //   'mousedown',
  //   function (e: MouseEvent) {

  //     document.addEventListener('mousemove', handleMoveMouse, true)
  //     isDown = true
  //     offset = [element.offsetLeft - e.clientX, element.offsetTop - e.clientY]

  //   },
  //   true,
  // )
  element.addEventListener(
    'mousedown',
    function (e: MouseEvent) {
      // Use closest to check the target itself or its parents for the 'not-resizer' class
      const target = e.target as HTMLElement | null
      if (!target?.closest('.not-resizer')) {
        document.addEventListener('mousemove', handleMoveMouse, true)
        isDown = true
        offset = [element.offsetLeft - e.clientX, element.offsetTop - e.clientY]

        // Handling resizers should also be inside this check to ensure 'not-resizer' is respected
        if (
          target &&
          'classList' in target &&
          target.classList.contains('resizer')
        ) {
          const resizer = target as HTMLElement // Type assertion to HTMLElement
          currentResizer = resizer.classList[1] // Ensure correct class index or use another method to identify the resizer type
          original_width = parseFloat(
            getComputedStyle(element)
              .getPropertyValue('width')
              .replace('px', ''),
          )
          original_height = parseFloat(
            getComputedStyle(element)
              .getPropertyValue('height')
              .replace('px', ''),
          )
          original_x = element.getBoundingClientRect().left
          original_y = element.getBoundingClientRect().top
          original_mouse_x = e.pageX
          original_mouse_y = e.pageY
        }
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
