import React, { useState } from 'react';
import { useFHE } from '../context/FHEContext';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import { FormState } from '../types';

export const AdminPanel: React.FC = () => {
  const { isInitialized, signer } = useFHE();
  const [expertId, setExpertId] = useState('');
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  const handleVerifyExpert = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInitialized || !signer) {
      setFormState(prev => ({ ...prev, error: 'Please connect wallet and initialize FHE' }));
      return;
    }

    try {
      setFormState({ isSubmitting: true, error: null, success: null });

      const id = parseInt(expertId);
      if (isNaN(id) || id < 1) {
        throw new Error('Invalid expert ID');
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log('Verifying expert...');
      const tx = await contract.verifyExpert(id);

      setFormState(prev => ({ ...prev, success: 'Transaction submitted. Waiting for confirmation...' }));

      const receipt = await tx.wait();
      console.log('Verification confirmed:', receipt);

      setFormState({
        isSubmitting: false,
        error: null,
        success: `✅ Expert ${id} verified successfully!`
      });

      setExpertId('');

    } catch (err: any) {
      console.error('Verification error:', err);
      setFormState({
        isSubmitting: false,
        error: err.message || 'Failed to verify expert',
        success: null
      });
    }
  };

  return (
    <div className="section">
      <h2>⚙️ Admin Panel</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Admin functions for managing experts and platform operations.
      </p>

      <form onSubmit={handleVerifyExpert}>
        <div className="form-group">
          <label htmlFor="expertId">Expert ID to Verify *</label>
          <input
            type="number"
            id="expertId"
            name="expertId"
            value={expertId}
            onChange={(e) => setExpertId(e.target.value)}
            placeholder="Enter expert ID"
            min="1"
            required
          />
          <small style={{ color: '#666' }}>
            Only verified experts can authenticate artworks
          </small>
        </div>

        <button
          type="submit"
          className="btn"
          disabled={!isInitialized || formState.isSubmitting}
        >
          {formState.isSubmitting ? '⏳ Verifying...' : '✅ Verify Expert'}
        </button>

        {formState.error && (
          <div className="error-message" style={{ marginTop: '15px' }}>
            ❌ {formState.error}
          </div>
        )}

        {formState.success && (
          <div className="success-message" style={{ marginTop: '15px' }}>
            {formState.success}
          </div>
        )}
      </form>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2em' }}>Admin Notes:</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Only contract owner can verify experts</li>
          <li>Experts must register before verification</li>
          <li>Verified experts can authenticate artworks</li>
          <li>Contract Address: <code style={{ background: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{CONTRACT_ADDRESS}</code></li>
        </ul>
      </div>
    </div>
  );
};
