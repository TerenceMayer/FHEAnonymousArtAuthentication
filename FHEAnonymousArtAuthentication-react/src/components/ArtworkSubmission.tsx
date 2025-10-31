import React, { useState } from 'react';
import { useFHE } from '../context/FHEContext';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import { FormState } from '../types';

export const ArtworkSubmission: React.FC = () => {
  const { client, isInitialized, signer } = useFHE();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: '',
    style: '',
    materials: '',
    condition: '80',
    consensus: '75'
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInitialized || !client || !signer) {
      setFormState(prev => ({ ...prev, error: 'Please connect wallet and initialize FHE' }));
      return;
    }

    try {
      setFormState({ isSubmitting: true, error: null, success: null });

      // Create metadata hash (simplified - in production, use proper hashing)
      const metadata = `${formData.title}|${formData.artist}|${formData.year}|${formData.style}|${formData.materials}`;
      const metadataHash = ethers.hashMessage(metadata);
      const metadataHashUint32 = parseInt(metadataHash.slice(0, 10), 16);

      const condition = parseInt(formData.condition);
      const consensus = parseInt(formData.consensus);

      // Validate inputs
      if (condition < 0 || condition > 100) {
        throw new Error('Condition must be between 0 and 100');
      }
      if (consensus < 51 || consensus > 100) {
        throw new Error('Consensus must be between 51 and 100');
      }

      // Get contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Submit artwork
      console.log('Submitting artwork...');
      const tx = await contract.submitArtwork(metadataHashUint32, condition, consensus);

      setFormState(prev => ({ ...prev, success: 'Transaction submitted. Waiting for confirmation...' }));

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Extract artwork ID from events
      const event = receipt.logs.find((log: any) => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog?.name === 'ArtworkSubmitted';
        } catch {
          return false;
        }
      });

      let artworkId = 'unknown';
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        artworkId = parsedEvent?.args[0].toString();
      }

      setFormState({
        isSubmitting: false,
        error: null,
        success: `✅ Artwork submitted successfully! ID: ${artworkId}`
      });

      // Reset form
      setFormData({
        title: '',
        artist: '',
        year: '',
        style: '',
        materials: '',
        condition: '80',
        consensus: '75'
      });

    } catch (err: any) {
      console.error('Submission error:', err);
      setFormState({
        isSubmitting: false,
        error: err.message || 'Failed to submit artwork',
        success: null
      });
    }
  };

  return (
    <div className="section">
      <h2>🎨 Submit Artwork for Authentication</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Submit your artwork for anonymous authentication. Expert information will remain encrypted.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Artwork Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Starry Night"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="artist">Artist Name *</label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            placeholder="e.g., Vincent van Gogh"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year Created *</label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="e.g., 1889"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="style">Art Style *</label>
          <select
            id="style"
            name="style"
            value={formData.style}
            onChange={handleInputChange}
            required
          >
            <option value="">Select style...</option>
            <option value="impressionism">Impressionism</option>
            <option value="expressionism">Expressionism</option>
            <option value="abstract">Abstract</option>
            <option value="realism">Realism</option>
            <option value="surrealism">Surrealism</option>
            <option value="contemporary">Contemporary</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="materials">Materials Used *</label>
          <textarea
            id="materials"
            name="materials"
            value={formData.materials}
            onChange={handleInputChange}
            placeholder="e.g., Oil on canvas"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="condition">
            Condition Score (0-100) *: {formData.condition}
          </label>
          <input
            type="range"
            id="condition"
            name="condition"
            min="0"
            max="100"
            value={formData.condition}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="consensus">
            Required Expert Consensus (51-100%) *: {formData.consensus}%
          </label>
          <input
            type="range"
            id="consensus"
            name="consensus"
            min="51"
            max="100"
            value={formData.consensus}
            onChange={handleInputChange}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={!isInitialized || formState.isSubmitting}
        >
          {formState.isSubmitting ? '⏳ Submitting...' : '📤 Submit Artwork'}
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
    </div>
  );
};
