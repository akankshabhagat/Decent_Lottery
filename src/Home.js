import React, {useState, useEffect} from "react";
import {ethers} from 'ethers';

// Import contract address & API 
import constants from './constants';

function Home () {
  // State to store the currently connected account
  const [currentAccount, setCurrentAccount] = useState("");

  // State to store the contract instance
  const [contractInstance, setcontractInstance] = useState('');

  // State to track if the lottery is finished or not
  const [status, setStatus] = useState(false);

  // State to store if the user is a winner
  const [isWinner, setIsWinner] = useState('');

  // Function to load blockchain data and set current account
  useEffect(() => {
    const loadBlockchainData = async () => {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          console.log(address); // Log the address
          setCurrentAccount(address); // Set the current account
          
          // Listen for account changes in MetaMask
          window.ethereum.on('accountsChanged', (accounts) => {
            setCurrentAccount(accounts[0]);
            console.log(currentAccount);
          })
        } catch (err) {
          console.error(err);
        }
      } else {
        alert('Please install Metamask to use this application');
      }
    };

    // Function to create and store contract instance
    const contract = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractIns = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
      setcontractInstance(contractIns);
      
      // Get status of lottery
      const status = await contractInstance.isComplete();
      setStatus(status);
      
      // Get winner and check if the current account is the winner
      const winner = await contractInstance.getWinner();
      if (winner === currentAccount) {
        setIsWinner(true);
      } else {
        setIsWinner(false);
      }
    }

    loadBlockchainData(); // Load blockchain data
    contract(); // Create contract
  }, [currentAccount]);

  // Function to enter the lottery
  const enterLottery = async () => {
    const amountToSend = ethers.utils.parseEther('0.001');
    const tx = await contractInstance.enter({value: amountToSend});
    await tx.wait();
  }

  // Function to claim prize
  const claimPrize = async () => {
    const tx = await contractInstance.claimPrize();
    await tx.wait();
  }
    
  // Render the component
  return (
    <div className="container">
      <h1>Lottery Page</h1>
      <div className="button-container">
        {status ? (isWinner ? (<button className="enter-button" onClick={claimPrize}> Claim Prize </button>) : 
          (<p>You are not the winner</p>)) : 
          (<button className="enter-button" onClick={enterLottery}> Enter Lottery </button>)
        }
      </div>
    </div>
  ); 
}

export default Home;
