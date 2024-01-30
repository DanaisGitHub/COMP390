import {LoginForm} from '../components/loginForm/loginForm'; 
import ProductPreview from '@/components/productPreview/productPreview';
import {SignUpForm} from '../components/signupForm/signupForm';
import {GoogleMaps} from '../components/Google_Maps/map';



type HomeCard = {
  id: number,
  title: string,
  description: string,
  link: string,
  image: any
}




const Home = () => {

  return <div>
    <ProductPreview nameOfProduct='hello' verified={true} nameOfSeller='Danai'></ProductPreview>
    <LoginForm/>
    <SignUpForm/>
    {/* <div className=" h-screen w-full"><GoogleMaps /></div> */}
    

    
  </div>

}

export default Home;