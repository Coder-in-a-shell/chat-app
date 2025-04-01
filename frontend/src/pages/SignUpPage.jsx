
const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
    });
    const {signUp , isSigningUp} = useAuthStore() 
    const validateForm = () => {
        const { fullname, email, password } = formData;
        if (!fullname || !email || !password) {
            return false;
        }
        return true;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            await signUp(formData);
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            
        </div>
    )
}

export default SignUpPage