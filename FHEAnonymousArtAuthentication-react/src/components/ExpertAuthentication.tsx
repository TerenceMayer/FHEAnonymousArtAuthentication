import React, { useState } from 'react';
import { useFHE } from '../context/FHEContext';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import { FormState } from '../types';

export const ExpertAuthentication: React.FC = () => {
  const { client, isInitialized, signer } = useFHE();
  const [activeTab, setActiveTab] = useState<'register' | 'authenticate'>('register');

  // Registration form
  const [registerData, setRegisterData] = useState({
    credentials: '75'
  });
  const [registerState, setRegisterState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  // Authentication form
  const [authData, setAuthData] = useState({
    artworkId: '',
    authenticity: '80',
    confidence: '85'
  });
  const [authState, setAuthState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInitialized || !client || !signer) {
      setRegisterState(prev => ({ ...prev, error: 'Please connect wallet and initialize FHE' }));
      return;
    }

    try {
      setRegisterState({ isSubmitting: true, error: null, success: null });

      const credentials = parseInt(registerData.credentials);
      if (credentials < 0 || credentials > 100) {
        throw new Error('Credentials must be between 0 and 100');
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log('Registering as expert...');
      const tx = await contract.registerExpert(credentials);

      setRegisterState(prev => ({ ...prev, success: 'Transaction submitted. Waiting for confirmation...' }));

      const receipt = await tx.wait();
      console.log('Registration confirmed:', receipt);

      // Extract expert ID from events
      const event = receipt.logs.find((log: any) => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog?.name === 'ExpertRegistered';
        } catch {
          return false;
        }
      });

      let expertId = 'unknown';
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        expertId = parsedEvent?.args[0].toString();
      }

      setRegisterState({
        isSubmitting: false,
        error: null,
        success: `✅ Expert registered successfully! Expert ID: ${expertId}. Please wait for admin verification.`
      });

      setRegisterData({ credentials: '75' });

    } catch (err: any) {
      console.error('Registration error:', err);
      setRegisterState({
        isSubmitting: false,
        error: err.message || 'Failed to register expert',
        success: null
      });
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInitialized || !client || !signer) {
      setAuthState(prev => ({ ...prev, error: 'Please connect wallet and initialize FHE' }));
      return;
    }

    try {
      setAuthState({ isSubmitting: true, error: null, success: null });

      const artworkId = parseInt(authData.artworkId);
      const authenticity = parseInt(authData.authenticity);
      const confidence = parseInt(authData.confidence);

      if (authenticity < 0 || authenticity > 100) {
        throw new Error('Authenticity must be between 0 and 100');
      }
      if (confidence < 0 || confidence > 100) {
        throw new Error('Confidence must be between 0 and 100');
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log('Submitting authentication...');
      const tx = await contract.submitAuthentication(artworkId, authenticity, confidence);

      setAuthState(prev => ({ ...prev, success: 'Transaction submitted. Waiting for confirmation...' }));

      const receipt = await tx.wait();
      console.log('Authentication confirmed:', receipt);

      setAuthState({
        isSubmitting: false,
        error: null,
        success: `✅ Authentication submitted successfully for Artwork ID: ${artworkId}`
      });

      setAuthData({
        artworkId: '',
        authenticity: '80',
        confidence: '85'
      });

    } catch (err: any) {
      console.error('Authentication error:', err);
      setAuthState({
        isSubmitting: false,
        error: err.message || 'Failed to submit authentication',
        success: null
      });
    }
  };

  return (
    <div className="section">
      <h2>👤 Expert Authentication</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          className={`btn ${activeTab === 'register' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('register')}
          style={{ marginRight: '10px' }}
        >
          Register as Expert
        </button>
        <button
          className={`btn ${activeTab === 'authenticate' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('authenticate')}
        >
          Authenticate Artwork
        </button>
      </div>

      {activeTab === 'register' ? (
        <div>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Register as an expert to authenticate artworks. Admin verification required.
          </p>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="credentials">
                Expertise Level (0-100) *: {registerData.credentials}
              </label>
              <input
                type="range"
                id="credentials"
                name="credentials"
                min="0"
                max="100"
                value={registerData.credentials}
                onChange={(e) => setRegisterData({ credentials: e.target.value })}
              />
              <small style={{ color: '#666' }}>
                Higher values indicate more experience and credentials
              </small>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={!isInitialized || registerState.isSubmitting}
            >
              {registerState.isSubmitting ? '⏳ Registering...' : '✍️ Register as Expert'}
            </button>

            {registerState.error && (
              <div className="error-message" style={{ marginTop: '15px' }}>
                ❌ {registerState.error}
              </div>
            )}

            {registerState.success && (
              <div className="success-message" style={{ marginTop: '15px' }}>
                {registerState.success}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Authenticate an artwork by providing your assessment scores.
          </p>
          <form onSubmit={handleAuthenticate}>
            <div className="form-group">
              <label htmlFor="artworkId">Artwork ID *</label>
              <input
                type="number"
                id="artworkId"
                name="artworkId"
                value={authData.artworkId}
                onChange={(e) => setAuthData(prev => ({ ...prev, artworkId: e.target.value }))}
                placeholder="Enter artwork ID"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="authenticity">
                Authenticity Score (0-100) *: {authData.authenticity}
              </label>
              <input
                type="range"
                id="authenticity"
                name="authenticity"
                min="0"
                max="100"
                value={authData.authenticity}
                onChange={(e) => setAuthData(prev => ({ ...prev, authenticity: e.target.value }))}
              />
              <small style={{ color: '#666' }}>
                0 = Definitely fake, 100 = Definitely authentic
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confidence">
                Confidence Level (0-100) *: {authData.confidence}
              </label>
              <input
                type="range"
                id="confidence"
                name="confidence"
                min="0"
                max="100"
                value={authData.confidence}
                onChange={(e) => setAuthData(prev => ({ ...prev, confidence: e.target.value }))}
              />
              <small style={{ color: '#666' }}>
                How confident are you in your assessment?
              </small>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={!isInitialized || authState.isSubmitting}
            >
              {authState.isSubmitting ? '⏳ Submitting...' : '✅ Submit Authentication'}
            </button>

            {authState.error && (
              <div className="error-message" style={{ marginTop: '15px' }}>
                ❌ {authState.error}
              </div>
            )}

            {authState.success && (
              <div className="success-message" style={{ marginTop: '15px' }}>
                {authState.success}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
