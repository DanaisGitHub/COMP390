import { LoginForm } from '../components/AuthForms/loginForm';
import ProductPreview from '@/components/Product/productPreview';
import { SignUpForm } from '../components/AuthForms/signupForm';







const Home = () => {

  return <div className='flex max-md:flex-col content-around justify-between h-[90vh] max-md:h-full'>
    <div className="w-1/2 max-md:w-full border border-orange-950 flex flex-col items-center justify-center bg-yellow-800">
      <LoginForm />
    </div>
    <div className="w-1/2 max-md:w-full border border-orange-950 ">
      <SignUpForm />
    </div>
  </div>
}

export default Home;
