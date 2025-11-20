// ConfirmDialogContainer.tsx
// react
import { FC } from 'react'
// redux
import { connect, ConnectedProps } from 'react-redux'
// actions and selectors
import {
  confirmDialogActions,
  confirmDialogReducer,
} from '@lms/contexts'

// component
import SappConfirmDialog from './SappConfirmDialog'

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
const SappConfirmDialogContainer: FC<PropsFromRedux> = (props: any) => {
  // render the confirm dialog component with the props from the state and dispatch
  return <SappConfirmDialog {...props} />
}

export default connector(SappConfirmDialogContainer)
