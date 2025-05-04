import type { NextPage } from 'next'
import ProfilePage from './[page]'

const Home: NextPage = () => {
  return <></>
}

export default Home

// export async function getServerSideProps(context: any) {
//   try {
//     const { req, res, query } = context

//     // Lấy accessToken từ cookie
//     const accessToken = req.cookies.accessToken

//     // Kiểm tra accessToken
//     if (!accessToken) {
//       // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
//       return {
//         redirect: {
//           destination: '/auth/login',
//           permanent: false,
//         },
//       }
//     }

//     return {
//       props: {},
//     }
//   } catch (err) {
//     return {
//       redirect: {
//         destination: '/auth/login',
//         permanent: false,
//       },
//     }
//   }
// }
