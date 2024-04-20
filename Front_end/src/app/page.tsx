import SignUpForm from '../components/AuthForms/SignUpForm';
import ProductPreview from '@/components/Product/productPreview';
import LoginForm from '../components/AuthForms/LoginForm';







const Home = () => {

  return <div className='flex max-md:flex-col content-around justify-between h-full bg-slate-100'>

    <div className="w-1/2 max-md:w-full border flex flex-col items-center justify-center ">
      <LoginForm />
    </div>
    <div className="w-1/2 max-md:w-full  ">
      <SignUpForm />
    </div>

  </div>
}

export default Home;
