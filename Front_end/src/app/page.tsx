import {LoginForm} from '../components/AuthForms/loginForm'; 
import ProductPreview from '@/components/productPreview/productPreview';
import {SignUpForm} from '../components/AuthForms/signupForm';







const Home = () => {

  return <div>
    <ProductPreview nameOfProduct='bookOfNarnia' nameOfSeller='Danai'></ProductPreview>
    <LoginForm/>
    <SignUpForm/>
    

    
  </div>

}

export default Home;