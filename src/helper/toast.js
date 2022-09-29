import { toast } from 'react-toastify';

const myToastId = 'myToastId'
export const normalToast = (message) => {
  toast(message);
}

export const successToast = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}

export const errorToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}

export const warnToast = (message) => {
  toast.warn(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}

export const infoToast = (message) => {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}


// toast("Custom Style Notification with css class!", {
//   position: toast.POSITION.BOTTOM_RIGHT,
//   className: 'foo-bar'
// });