import React, { Component } from 'react'

const KeyPadComponent = (props: any) => {
  return (
    <div className="button">
      <button
        className="w-1/4 h-1/5"
        name="("
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        (
      </button>
      <button
        className="w-1/4 h-1/5"
        name="CE"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        CE
      </button>
      <button
        className="w-1/4 h-1/5"
        name=")"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        )
      </button>
      <button
        className="w-1/4 h-1/5"
        name="C"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        C
      </button>
      <br />

      <button
        className="w-1/4 h-1/5"
        name="1"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        1
      </button>
      <button
        className="w-1/4 h-1/5"
        name="2"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        2
      </button>
      <button
        className="w-1/4 h-1/5"
        name="3"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        3
      </button>
      <button
        className="w-1/4 h-1/5"
        name="+"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        +
      </button>
      <br />

      <button
        className="w-1/4 h-1/5"
        name="4"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        4
      </button>
      <button
        className="w-1/4 h-1/5"
        name="5"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        5
      </button>
      <button
        className="w-1/4 h-1/5"
        name="6"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        6
      </button>
      <button
        className="w-1/4 h-1/5"
        name="-"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        -
      </button>
      <br />

      <button
        className="w-1/4 h-1/5"
        name="7"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        7
      </button>
      <button
        className="w-1/4 h-1/5"
        name="8"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        8
      </button>
      <button
        className="w-1/4 h-1/5"
        name="9"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        9
      </button>
      <button
        className="w-1/4 h-1/5"
        name="*"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        x
      </button>
      <br />

      <button
        className="w-1/4 h-1/5"
        name="."
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        .
      </button>
      <button
        className="w-1/4 h-1/5"
        name="0"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        0
      </button>
      <button
        className="w-1/4 h-1/5"
        name="="
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        =
      </button>
      <button
        className="w-1/4 h-1/5"
        name="/"
        onClick={(e: any) => props.onClick(e.target.name)}
      >
        ÷
      </button>
      <br />
    </div>
  )
}

export default KeyPadComponent
