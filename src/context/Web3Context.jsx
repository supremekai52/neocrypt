import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from '../contracts/contractConfig';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Web3 connection
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      // Initialize contract
      const contractInstance = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        web3Signer
      );

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Store connection state
      localStorage.setItem('walletConnected', 'true');

    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem('walletConnected');
  };

  // Switch network
  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (err) {
      console.error('Network switch error:', err);
      setError(err.message);
    }
  };

  // Contract interaction methods
  const createCollectionEvent = async (eventData) => {
    try {
      if (!contract) throw new Error('Contract not initialized');

      const tx = await contract.createCollectionEvent(
        eventData.speciesCode,
        eventData.speciesName,
        eventData.part,
        Math.round(eventData.lat * 1000000), // Convert to integer
        Math.round(eventData.lon * 1000000),
        eventData.geohash,
        Math.round(eventData.gpsAccuracy * 100),
        eventData.harvestMethod,
        Math.round(eventData.moisturePct * 100),
        Math.round(eventData.foreignMatterPct * 100),
        eventData.rulesVersion,
        eventData.regionId,
        Math.round(eventData.weightKg * 1000) // Convert to grams
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error('Collection event creation error:', err);
      throw err;
    }
  };

  const addProcessingStep = async (stepData) => {
    try {
      if (!contract) throw new Error('Contract not initialized');

      const tx = await contract.addProcessingStep(
        stepData.inputRefs,
        stepData.type,
        Math.round(new Date(stepData.timestampStart).getTime() / 1000),
        Math.round(new Date(stepData.timestampEnd).getTime() / 1000),
        Math.round(stepData.tempC * 100),
        Math.round(stepData.humidityPct * 100),
        Math.round(stepData.durationHrs * 100),
        stepData.locationGeohash,
        Math.round(stepData.outputWeightKg * 1000)
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error('Processing step creation error:', err);
      throw err;
    }
  };

  const addQualityTest = async (testData) => {
    try {
      if (!contract) throw new Error('Contract not initialized');

      const tx = await contract.addQualityTest(
        testData.subjectRef,
        testData.testType,
        testData.specVersion,
        testData.resultValue,
        testData.resultUnit || '',
        testData.pass,
        testData.methodRef || '',
        testData.artifactRef,
        testData.artifactHash
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error('Quality test creation error:', err);
      throw err;
    }
  };

  const createBatch = async (batchData) => {
    try {
      if (!contract) throw new Error('Contract not initialized');

      const tx = await contract.createBatch(
        batchData.inputs,
        batchData.lotCode,
        batchData.qaGates
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error('Batch creation error:', err);
      throw err;
    }
  };

  const mintBatch = async (batchId, qrSerial, publicSlug) => {
    try {
      if (!contract) throw new Error('Contract not initialized');

      const tx = await contract.mintBatch(batchId, qrSerial, publicSlug);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error('Batch minting error:', err);
      throw err;
    }
  };

  // Event listeners
  useEffect(() => {
    if (window.ethereum) {
      // Account change handler
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      // Chain change handler
      const handleChainChanged = (chainId) => {
        setChainId(Number(chainId));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Auto-connect if previously connected
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected === 'true') {
        connectWallet();
      }

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value = {
    provider,
    signer,
    contract,
    account,
    chainId,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    createCollectionEvent,
    addProcessingStep,
    addQualityTest,
    createBatch,
    mintBatch,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};