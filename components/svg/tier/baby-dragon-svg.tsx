import React, { SVGProps } from 'react'

export const BabyDragonSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="#B1EEC5" />
    <mask
      id="mask0_2308_3909"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="32"
      height="32"
    >
      <circle cx="16" cy="16" r="16" fill="#41C7AF" />
    </mask>
    <g mask="url(#mask0_2308_3909)">
      <path
        d="M25.5717 14.0382C25.5717 13.4189 26.0451 12.5971 26.0451 12.4063C26.0451 12.0001 25.0916 12.145 25.0468 11.7579C24.9185 10.6469 26.2047 9.70303 23.9749 9.70675C23.1449 9.70799 23.8067 8.6118 23.8067 8.01912C23.8067 7.42644 22.2129 7.92932 21.626 7.92932C21.0385 7.92932 21.0385 6.1519 20.4516 6.1519C18.6896 6.1519 18.1021 7.92932 17.5152 7.92932C16.9276 7.92932 16.4445 5.68741 15.7532 6.1519C13.9912 7.33664 13.4043 10.8915 13.4043 10.8915C13.4043 10.8915 16.3407 8.522 19.864 9.11407C23.1455 9.66587 22.8047 15.8156 23.3272 19.5736L17.0135 32.3694H19.0763C19.2875 31.4404 22.3689 27.7417 22.6365 27.0246C22.8704 26.3954 22.2252 25.807 22.5788 25.1858C22.9324 24.5647 23.1792 24.7183 23.8644 24.3343C24.5907 23.9274 23.8644 22.9724 23.8644 22.3797C23.8644 21.7877 25.2838 21.4049 25.2838 20.8123C25.2838 20.4221 24.6281 20.0121 24.7859 19.3525C24.9437 18.6936 25.7596 18.6186 25.8596 18C25.9438 17.476 25.2942 17.0989 25.371 16.5186C25.4477 15.9376 26.0917 15.6645 26.0917 15.2199C26.0917 14.7746 25.5717 14.5993 25.5717 14.0382Z"
        fill="#3E721D"
      />
      <path
        d="M25.1502 14.1082C25.1502 11.6074 23.3883 8.48176 19.2774 8.48176C15.1665 8.48176 8.67796 14.6897 6.94484 14.7337C5.76978 13.5279 4.00781 14.7678 4.00781 15.9841C4.00781 17.8594 7.30706 18.8391 7.47404 19.0175C8.142 19.7297 9.88064 24.0234 12.8177 20.2227C13.31 19.5842 13.6164 19.9613 14.956 20.5583C19.399 22.9464 11.8499 32.4924 11.8499 32.4924H17.7228C20.6586 29.5303 25.1502 19.4956 25.1502 14.4457L25.1373 14.4507C25.141 14.3367 25.1502 14.2222 25.1502 14.1082Z"
        fill="#77B255"
      />
      <path
        d="M18.6907 13.2618C18.6907 13.576 18.5669 13.8773 18.3467 14.0995C18.1264 14.3217 17.8277 14.4465 17.5162 14.4465C17.2048 14.4465 16.906 14.3217 16.6858 14.0995C16.4655 13.8773 16.3418 13.576 16.3418 13.2618C16.3418 12.9476 16.4655 12.6462 16.6858 12.424C16.906 12.2019 17.2048 12.077 17.5162 12.077C17.8277 12.077 18.1264 12.2019 18.3467 12.424C18.5669 12.6462 18.6907 12.9476 18.6907 13.2618Z"
        fill="#292F33"
      />
      <path
        d="M14.4451 17.0643C14.4451 17.4716 14.2158 17.4323 13.9331 17.4323C13.6508 17.4323 13.4219 17.4716 13.4219 17.0643C13.4219 16.6578 13.6508 15.5916 13.9331 15.5916C14.2158 15.5916 14.4451 16.6578 14.4451 17.0643Z"
        fill="white"
      />
      <path
        d="M12.8084 17.8414C12.8084 18.2938 12.5791 18.2506 12.2968 18.2506C12.014 18.2506 11.7852 18.2938 11.7852 17.8414C11.7852 17.3898 12.014 16.2053 12.2968 16.2053C12.5791 16.2053 12.8084 17.3898 12.8084 17.8414Z"
        fill="white"
      />
      <path
        d="M14.879 16.5956C12.1941 17.9451 8.82648 18.6571 7.47461 19.0182C7.64344 19.1978 7.88041 19.6065 8.18799 20.0549C9.67001 19.6685 12.7057 19.0182 15.0454 17.7692C15.1217 17.7582 15.1952 17.7321 15.2616 17.6924C15.328 17.6528 15.386 17.6003 15.4323 17.538C15.4786 17.4757 15.5123 17.4049 15.5314 17.3294C15.5506 17.254 15.5548 17.1756 15.5439 17.0985C15.5329 17.0214 15.5071 16.9473 15.4677 16.8803C15.4284 16.8134 15.3764 16.7548 15.3147 16.7081C15.2529 16.6615 15.1827 16.6275 15.1079 16.6082C15.0332 16.5889 14.9554 16.5846 14.879 16.5956Z"
        fill="#3E721D"
      />
      <path
        d="M16.6742 10.8645C16.6499 10.8514 16.6285 10.8336 16.6112 10.812C16.594 10.7904 16.5812 10.7655 16.5736 10.7389C16.566 10.7124 16.5636 10.6847 16.5666 10.6572C16.5696 10.6298 16.578 10.6031 16.5912 10.5789C16.6044 10.5546 16.6223 10.5331 16.6437 10.5157C16.6652 10.4983 16.6898 10.4853 16.7161 10.4774C16.7529 10.4664 17.6279 10.2131 18.5727 10.7272C18.6215 10.7538 18.6577 10.7988 18.6732 10.8523C18.6888 10.9059 18.6825 10.9636 18.6557 11.0128C18.6289 11.062 18.5839 11.0987 18.5304 11.1147C18.477 11.1307 18.4196 11.1248 18.3709 11.0983C17.5836 10.6698 16.84 10.8792 16.8326 10.8815C16.7795 10.897 16.7226 10.891 16.6742 10.8645Z"
        fill="#3E721D"
      />
    </g>
  </svg>
)
