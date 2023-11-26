// ConfirmDialogContainer.tsx
// react
import { FC } from 'react'
// redux
import { connect, ConnectedProps } from 'react-redux'
// actions and selectors
import {
  confirmDialogActions,
  confirmDialogReducer,
} from '../../../redux/slice/ConfirmDialog/ConfirmDialogSlice'

// component
import ConfirmDialog from './ConfirmDialog'

// define the props from the state
const mapStateToProps = (state: any) => {
  return {
    // use the spread operator to create a new object with the state values
    ...confirmDialogReducer(state),
  }
}

// create the connector
const connector = connect(mapStateToProps, confirmDialogActions)

// define the props type
type PropsFromRedux = ConnectedProps<typeof connector>

// create the container component
const ConfirmDialogContainer: FC<PropsFromRedux> = (props: any) => {
  // render the confirm dialog component with the props from the state and dispatch
  return <ConfirmDialog {...props} />
}

export default connector(ConfirmDialogContainer)
