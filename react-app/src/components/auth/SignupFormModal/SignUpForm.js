import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { signUp } from "../../../store/session";
import DemoLogin from "../DemoLogin";

import "./SignupForm.css";

const SignUpForm = () => {
	const [errors, setErrors] = useState({});
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [image, setImage] = useState(null);
	const [imageLoading, setImageLoading] = useState(false);
	const user = useSelector((state) => state.session.user);
	const dispatch = useDispatch();

	const onSignUp = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		if (password === repeatPassword) {
			formData.append("username", username);
			formData.append("email", email);
			formData.append("password", password);
			if (image) {
				formData.append("image", image);
				setImageLoading(true);
			}
			const data = await dispatch(signUp(formData));
			setImageLoading(false);
			if (data) {
				const errors = {};
				const dataArr = data.map((error) => error.split(":"));

				for (let i = 0; i < dataArr.length; i++) {
					errors[dataArr[i][0]] = dataArr[i][1];
				}

				setErrors(errors);
				setImageLoading(false);
				return;
			}
		} else {
			const errors = {};
			errors["password"] = "Passwords do not match.";
			setErrors(errors);
			return;
		}
	};
	const updateImage = (e) => {
		const file = e.target.files[0];
		setImage(file);
	};
	const updateUsername = (e) => {
		setUsername(e.target.value);
	};

	const updateEmail = (e) => {
		setEmail(e.target.value);
	};

	const updatePassword = (e) => {
		setPassword(e.target.value);
	};

	const updateRepeatPassword = (e) => {
		setRepeatPassword(e.target.value);
	};

	useEffect(() => {
		return () => {
			setErrors({});
			setUsername("");
			setEmail("");
			setPassword("");
			setRepeatPassword("");
			setImage(null);
			setImageLoading(false);
		};
	}, []);

	if (user) {
		return <Redirect to="/" />;
	}


	return (
		<form onSubmit={onSignUp} className="signup-form">
			<div className="modal-head sign-up-modal-head">
				Sign Up for SplitX
			</div>
			<div className="signup-form-elements-container">
				<div className="sf-form-inputs-container">
					<div className="signup-element-container">
						<input
							type="text"
							name="username"
							onChange={updateUsername}
							placeholder="Username"
							value={username}
							required={true}

						></input>
						<div className="errors-container">
							{errors.username ? `${errors.username}` : ""}
						</div>
					</div>

					<div className="signup-element-container">
						<input
							type="email"
							name="email"
							placeholder="Email"
							onChange={updateEmail}
							value={email}
							required={true}

						></input>
						<div className="errors-container">
							{errors.email ? `${errors.email}` : ""}
						</div>
					</div>

					<div className="signup-element-container">
						<input
							type="password"
							name="password"
							placeholder="Password"
							onChange={updatePassword}
							value={password}
							required={true}

						></input>
					</div>

					<div className="signup-element-container">
						<input
							type="password"
							name="repeat_password"
							placeholder="Confirm Password"
							onChange={updateRepeatPassword}
							value={repeatPassword}
							required={true}
						></input>
						<div className="errors-container">
							{errors.password ? `${errors.password}` : ""}
						</div>
					</div>
				</div>

				<div className="sf-add-image-container">
					<input
						id="file-upload"
						type="file"
						accept="image/*"
						onChange={updateImage}
					></input>
					<div className="preview-container">
						{image && (
							<img
								alt="preview"
								src={URL.createObjectURL(image)}
								className="preview-image"
							></img>
						)}
					</div>
					<label htmlFor="file-upload">Add Profile Image</label>
					{imageLoading && (
						<p>
							<i className="fas fa-spinner fa-pulse"></i>
						</p>
					)}
				</div>
			</div>

			<div className="sf-btn-container">
				<button type="submit">Sign Up</button>
				<DemoLogin />
			</div>
		</form>
	);
};

export default SignUpForm;
