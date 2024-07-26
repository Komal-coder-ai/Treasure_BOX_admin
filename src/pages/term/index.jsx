
import { Container, Grid } from '@mui/material';
import './index.css'
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useState ,useEffect} from 'react';
import { TermcreateApi, getApiCallToken, getTermsandCondition, postApiCallToken } from '../../API/baseUrl';
import CkEditor from '../../Components/ckEditor';
import SearchToolbar from '../../Components/Search/Search';
import { TermsHeading } from '../../Components/Heading';
import ButtonComponent from '../../Components/Button';
import ToastMessage from '../../utils/ToastMessage';

export default function Term() {
    const [ckValue , setCkValue] =useState("")
    const Intial = {
        privacyContent: ''
    }

    const [editTerms, setEditTerms] = useState(true)
    const [loading, setLoading] = useState(false)

    const { setValues, handleBlur, handleSubmit, handleChange, values, errors, setFieldValue } = useFormik({
        initialValues: Intial,
        // validationSchema: privacySchema,
        enableReinitialize: true,
        onSubmit: () => handlePrivacyData(),
    });


    const handlePrivacyData = async () => {
        setLoading(true)
        const id = 2
        setLoading(true)
        try {
            const result = await postApiCallToken(`${TermcreateApi}${id}`,{
                privacy_policy:ckValue,
                id:2
            })
            if(result.data.status){
                ToastMessage("success",result.data.message)
                setLoading(false)
                setLoading(false)
            }
        } catch (error) {
            console.log("errors",error);
        }
        finally{
            setLoading(false)
        }
       
    }




    const ckChange = (text, type, key, index) => {
        values.privacyContent = type.getData()
        setCkValue(type.getData())
        setFieldValue("privacyContent", values.privacyContent)
    }



    const handleEditTerms = () => {
        setEditTerms(false)
        setFieldValue("privacyContent", values.privacyContent)
    }

    const handleUpdateTerms = () => {
        setEditTerms(true)
        setFieldValue("privacyContent", values.privacyContent)
        handleSubmit()
    }


    const privacyGet = async()=>{
        const id = 2
        try {
            const result = await getApiCallToken(`${getTermsandCondition}${id}` )        
            setCkValue(result.data.data.privacy_policy)
        } catch (error) {
            console.log("errors",error);
        }
    }


    useEffect(()=>{
        privacyGet()
    },[])

    

 const toolbarConfig = {
    
    toolbar: [
      // Put other toolbar options here as needed
      'heading',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'blockQuote',
      'undo',
      'redo',
    ],
  };
  
  
    return (
        <div className='dashboardclass'>

            <Container maxWidth="false" className="containerdivuser">
            <SearchToolbar
              margin="0px"
              // setSearchtext={setSearchtext}
              headingName={TermsHeading}
              // btnname={"Add Products"}
              // handleOpen={handleOpen}
            />
            </Container>

            {/* <Container maxWidth="xl"  */}
            <Grid item xs={12} md={12} sx={{padding:"5px 25px"}}>
                <Grid item xs={12} md={12} className='CKEditHeightClass privacyImageCKEditor'>
                    <CkEditor
                    config={toolbarConfig}
                        disable={editTerms}
                        onChange={(text, type) => ckChange(text, type, "content")}
                        data={ckValue}                                                
                        name="privacyCkedit"
                        label="privacyCkedit"
                        autoComplete="off"
                        sx={{ width: '100%' }}
                        onBlur={handleBlur}
                        value={ckValue}
                    />
                </Grid>

                <Grid sx={{ mt: 4, mb: 4 , display:"flex" , justifyContent:"flex-end"}} className='nearByButtonClass'>
                <ButtonComponent loading={loading} btn_name="UPDATE" type="submit" onClick={handlePrivacyData}/>
                   
                </Grid>
            </Grid>
        </div>
    );
}
