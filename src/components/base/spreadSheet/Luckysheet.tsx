import React from 'react'
type Props = {
  id: string
}
// type State = {

// }
class Luckysheet extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      idContainer: props.id,
    }
  }
  componentDidMount() {
    const luckysheet = window.luckysheet as any
    luckysheet.create({
      container: `${this.props.id}`,
      title: 'test',
      myFolderUrl: '',

      // plugins:['chart']
    })
  }
  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<{}>,
    snapshot?: any,
  ): void {
    const luckysheet = window.luckysheet as any
    luckysheet.create({
      container: `${this.props.id}`,
      title: 'test',
      myFolderUrl: '',

      // plugins:['chart']
    })
    // console.log(prevProps,this.props.id);
  }
  render() {
    return (
      <div
        id={`${this.props.id}`}
        className="sheet"
        style={{
          margin: '0px',
          padding: '0px',
          width: '100%',
          height: '100%',
          left: '0px',
          top: '0px',
          position: 'relative',
        }}
      ></div>
    )
  }
}

export default Luckysheet
