export const CloseDetailIcon = ({
  width = 24,
  height = 24,
  className
}: {
  width?: number;
  height?: number;
  isActive?: boolean;
  className?: string
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM6.25 12C6.25 12.4142 6.58579 12.75 7 12.75H12.1893L10.4697 14.4697C10.1768 14.7626 10.1768 15.2374 10.4697 15.5303C10.7626 15.8232 11.2374 15.8232 11.5303 15.5303L14.5303 12.5303C14.671 12.3897 14.75 12.1989 14.75 12C14.75 11.8011 14.671 11.6103 14.5303 11.4697L11.5303 8.46967C11.2374 8.17678 10.7626 8.17678 10.4697 8.46967C10.1768 8.76256 10.1768 9.23744 10.4697 9.53033L12.1893 11.25H7C6.58579 11.25 6.25 11.5858 6.25 12ZM17.75 8C17.75 7.58579 17.4142 7.25 17 7.25C16.5858 7.25 16.25 7.58579 16.25 8V16C16.25 16.4142 16.5858 16.75 17 16.75C17.4142 16.75 17.75 16.4142 17.75 16V8Z"
        fill="#1C274C"
      />
    </svg>
  );
};

export const SkeletonDetailIcon = () => {
  return (
    <svg
      width="249"
      height="250"
      viewBox="0 0 249 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_5343_151135)">
        <rect
          x="20.5859"
          y="40.7258"
          width="183.773"
          height="183.773"
          rx="19.6025"
          fill="white"
        />
        <rect
          x="38.9688"
          y="59.104"
          width="147.019"
          height="17.1522"
          rx="8.57609"
          fill="#F7F7F7"
        />
        <rect
          x="96.5469"
          y="90.9602"
          width="46.5559"
          height="44.1056"
          rx="7.35094"
          fill="#F7F7F7"
        />
        <rect
          x="139.43"
          y="144.864"
          width="46.5559"
          height="44.1056"
          rx="7.35094"
          fill="#F7F7F7"
        />
        <rect
          x="38.9688"
          y="160.792"
          width="46.5559"
          height="44.1056"
          rx="7.35094"
          fill="#F7F7F7"
        />
        <rect
          x="38.9688"
          y="101.984"
          width="46.5559"
          height="22.0528"
          rx="7.35094"
          fill="#F7F7F7"
        />
        <rect
          x="96.5469"
          y="182.846"
          width="33.0792"
          height="22.0528"
          rx="7.35094"
          fill="#F7F7F7"
        />
      </g>
      <g filter="url(#filter1_d_5343_151135)">
        <rect
          x="151.906"
          y="18.5007"
          width="72.509"
          height="72.509"
          rx="12.0848"
          fill="white"
        />
        <path
          d="M192.971 43.9835C191.95 41.9157 190.346 40.8818 188.158 40.8818C185.97 40.8818 184.348 41.9157 183.29 43.9835C182.269 46.0514 181.759 49.6419 181.759 54.7551C181.759 59.8684 182.269 63.4589 183.29 65.5268C184.348 67.5946 185.97 68.6285 188.158 68.6285C190.346 68.6285 191.95 67.5946 192.971 65.5268C194.029 63.4589 194.557 59.8684 194.557 54.7551C194.557 49.6419 194.029 46.0514 192.971 43.9835ZM200.082 70.9408C197.493 74.2493 193.518 75.9036 188.158 75.9036C182.798 75.9036 178.805 74.2493 176.18 70.9408C173.591 67.6322 172.297 62.237 172.297 54.7551C172.297 47.2733 173.591 41.8781 176.18 38.5695C178.805 35.261 182.798 33.6067 188.158 33.6067C193.518 33.6067 197.493 35.261 200.082 38.5695C202.707 41.8781 204.02 47.2733 204.02 54.7551C204.02 62.237 202.707 67.6322 200.082 70.9408Z"
          fill="#E5E7EB"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_5343_151135"
          x="0.585938"
          y="25.7258"
          width="223.773"
          height="223.773"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="5" />
          <feGaussianBlur stdDeviation="10" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5343_151135"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5343_151135"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_5343_151135"
          x="127.737"
          y="0.373483"
          width="120.847"
          height="120.848"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="6.04242" />
          <feGaussianBlur stdDeviation="12.0848" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5343_151135"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5343_151135"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const StatusDotIcon = () => {
  return (
    <svg
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </svg>
  );
};

export const ZoomIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#22AAFF" />
      <path
        d="M6.2 7.5C5.67533 7.5 5.25 7.9797 5.25 8.57143V13.7679C5.25 15.2768 6.33459 16.5 7.6725 16.5L13.3 16.4464C13.8247 16.4464 14.25 15.9668 14.25 15.375V10.125C14.25 8.6161 12.9629 7.50002 11.625 7.50002L6.2 7.5Z"
        fill="white"
      />
      <path
        d="M15.5342 9.5457C15.1947 9.88137 15 10.3658 15 10.875V13.0495C15 13.5587 15.1947 14.0431 15.5342 14.3788L17.6466 16.2393C18.0765 16.6644 18.75 16.3201 18.75 15.6754V8.35137C18.75 7.70666 18.0765 7.3624 17.6466 7.78742L15.5342 9.5457Z"
        fill="white"
      />
    </svg>
  );
};
