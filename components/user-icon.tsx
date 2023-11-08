import React from 'react'

export default function UserIcon({
  address,
  ...props
}: React.BaseHTMLAttributes<HTMLDivElement> & { address: `0x${string}` }) {
  const matches = address.substring(2).match(/.{1,6}/g)
  if (!matches) {
    return <></>
  }
  const [color1, color2, color3, color4] = matches

  return (
    <div
      {...props}
      style={{
        background: `
          radial-gradient(ellipse at top left, #${color1} 15%, transparent 60%), 
          radial-gradient(ellipse at bottom left, #${color2} 15%, transparent 60%),
          radial-gradient(ellipse at top right, #${color3} 15%, transparent 60%),
          radial-gradient(ellipse at bottom right, #${color4} 15%, transparent 60%)
        `,
      }}
    >
      <svg
        className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2"
        viewBox="0 0 99 114"
      >
        <path
          fill="#fff"
          d="M28.336 106.399a55.837 55.837 0 0 1-20.9-20.634 55.12 55.12 0 0 1-7.432-28.28 56.73 56.73 0 0 1 7.39-28.59 53.23 53.23 0 0 1 20.394-20.73A58.773 58.773 0 0 1 57.626.712 58.97 58.97 0 0 1 80.62 4.777a44.88 44.88 0 0 1 15.74 11.246 2.423 2.423 0 0 1-.274 3.388L84.04 29.844a2.478 2.478 0 0 1-3.285 0 32.342 32.342 0 0 0-10.662-6.76 32.594 32.594 0 0 0-12.468-2.183 33.655 33.655 0 0 0-17.936 4.773 33.19 33.19 0 0 0-12.586 13.52 39.104 39.104 0 0 0-4.243 18.291 39.242 39.242 0 0 0 4.38 18.292A32.65 32.65 0 0 0 39.559 88.92a35.591 35.591 0 0 0 18.477 4.743c9.581 0 17.382-2.981 23.678-9.078a2.478 2.478 0 0 1 3.285 0l12.455 10.568a2.308 2.308 0 0 1 .89 1.634 2.283 2.283 0 0 1-.616 1.754 49.95 49.95 0 0 1-15.603 10.839 60.747 60.747 0 0 1-24.5 4.607 56.55 56.55 0 0 1-29.29-7.588Z"
        />
      </svg>
    </div>
  )
}
