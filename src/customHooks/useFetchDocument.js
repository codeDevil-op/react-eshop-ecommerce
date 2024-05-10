import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from '../firebase/config';
import { useParams } from 'react-router-dom';

const useFetchDocument = (collectionName,documentID) => {

    const [document, setDocument] = useState(null)
    
    const getDocument = async()=>{
        const docRef = doc(db, collectionName, documentID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
    
      const newObj = {
        id:documentID,
        ...docSnap.data(),
      }
    
      setDocument(newObj)
      
    } else {
      // docSnap.data() will be undefined in this case
      toast.error('document Not Found')
    }
      }
      useEffect(() => {
        getDocument();
      }, [document])
      
      return {document}
}

export default useFetchDocument