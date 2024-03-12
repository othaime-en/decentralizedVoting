// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title DecentralizedVoting
 * @author Othman Suleyman
 * @notice This is a decentralized voting contract that allows users
 * @notice to create voting instances and vote for candidates in those instances.
 */

contract DecentralizedVoting {
    enum InstanceStatus {
        Open,
        Ongoing,
        Closed
    }

    struct VotingInstance {
        uint256 id;
        string name;
        string organizationName;
        string description;
        address creator;
        InstanceStatus status;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        address[] voters;
        mapping(address => string[]) votedRoles;
        uint256 startTime;
        uint256 endTime;
        bool exists;
        bool isPrivate;
    }

    struct Candidate {
        uint256 id;
        string name;
        string role;
        string description;
        uint256 voteCount;
    }

    struct VotingInstanceDetails {
        uint256 id;
        string name;
        string organizationName;
        string description;
        address creator;
        uint256 candidateCount;
        InstanceStatus status;
    }

    uint256 public instanceId;
    mapping(uint256 => VotingInstance) public instances;
    address public admin;

    event VotingInstanceCreated(
        uint256 indexed id,
        string name,
        address indexed creator
    );
    event CandidateAdded(
        uint256 indexed instanceId,
        uint256 indexed candidateId,
        string candidateName,
        string candidateRole,
        string candidateDescription
    );
    event VoteCasted(
        uint256 indexed instanceId,
        uint256 indexed candidateId,
        address indexed voter
    );
    event CandidateUpdated(
        uint256 indexed instanceId,
        uint256 indexed candidateId,
        string newCandidateName,
        string newCandidateRole,
        string newCandidateDescription
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyOwner(uint256 _instanceId) {
        require(
            msg.sender == instances[_instanceId].creator || msg.sender == admin,
            "Only the creator or admin can perform this operation"
        );
        _;
    }

    modifier instanceMustExist(uint256 _instanceId) {
        require(instanceExists(_instanceId), "Instance does not exist");
        _;
    }

    function createInstance(
        string memory _name,
        string memory _organizationName,
        string memory _description
    ) public returns (uint256) {
        VotingInstance storage instance = instances[++instanceId];
        instance.id = instanceId;
        instance.name = _name;
        instance.organizationName = _organizationName;
        instance.description = _description;
        instance.creator = msg.sender;
        instance.status = InstanceStatus.Open;
        instance.exists = true;
        instance.isPrivate = false;
        emit VotingInstanceCreated(instanceId, _name, msg.sender);

        return instanceId;
    }

    function closeInstance(uint256 _instanceId) public onlyOwner(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        instance.status = InstanceStatus.Closed;
        instance.endTime = block.timestamp;
    }

    function makePrivate(uint256 _instanceId) public onlyOwner(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(!instance.isPrivate, "Instance is already private");
        instance.isPrivate = true;
    }

    function extendVoting(
        uint256 _instanceId,
        uint256 _additionalTime
    ) public onlyOwner(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            instance.status == InstanceStatus.Ongoing,
            "Cannot extend a voting instance that is not ongoing"
        );

        instance.endTime += _additionalTime;
    }

    function addCandidates(
        uint256 _instanceId,
        string[] memory _candidateNames,
        string[] memory _candidateRoles,
        string[] memory _candidateDescriptions
    ) public onlyOwner(_instanceId) instanceMustExist(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            instance.status == InstanceStatus.Open,
            "Cannot add candidates after voting has started or instance is closed"
        );

        require(
            _candidateNames.length == _candidateRoles.length &&
                _candidateRoles.length == _candidateDescriptions.length,
            "Input arrays must have the same length"
        );

        for (uint i = 0; i < _candidateNames.length; i++) {
            uint256 candidateId = instance.candidateCount + 1;
            instance.candidates[candidateId] = Candidate({
                id: candidateId,
                name: _candidateNames[i],
                role: _candidateRoles[i],
                description: _candidateDescriptions[i],
                voteCount: 0
            });
            instance.candidateCount++;
            emit CandidateAdded(
                _instanceId,
                candidateId,
                _candidateNames[i],
                _candidateRoles[i],
                _candidateDescriptions[i]
            );
        }
    }

    function updateCandidate(
        uint256 _instanceId,
        uint256 _candidateId,
        string memory _newCandidateName,
        string memory _newCandidateRole,
        string memory _newCandidateDescription
    ) public instanceMustExist(_instanceId) onlyOwner(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            instance.status == InstanceStatus.Open,
            "Cannot update candidates after voting has started or instance is closed"
        );

        Candidate storage candidate = instance.candidates[_candidateId];
        require(candidate.id > 0, "Invalid candidate ID");

        candidate.name = _newCandidateName;
        candidate.role = _newCandidateRole;
        candidate.description = _newCandidateDescription;

        emit CandidateUpdated(
            _instanceId,
            _candidateId,
            _newCandidateName,
            _newCandidateRole,
            _newCandidateDescription
        );
    }

    function removeCandidate(
        uint256 _instanceId,
        uint256 _candidateId
    ) public onlyOwner(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            instance.status == InstanceStatus.Open,
            "Cannot remove candidates after voting has started"
        );

        Candidate storage candidate = instance.candidates[_candidateId];
        require(candidate.id > 0, "Invalid candidate ID");

        // Move the last candidate to the slot of the one to delete
        instance.candidates[_candidateId] = instance.candidates[
            instance.candidateCount
        ];
        // Remove the slot of the last candidate
        delete instance.candidates[instance.candidateCount];
        instance.candidateCount--;
    }

    function startVoting(
        uint256 _instanceId,
        uint256 _duration
    ) public onlyOwner(_instanceId) instanceMustExist(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            instance.status == InstanceStatus.Open,
            "Cannot start a voting instance that is not open"
        );

        instance.startTime = block.timestamp;
        instance.endTime = instance.startTime + _duration;
        require(block.timestamp < instance.endTime, "Voting has already ended");

        instance.status = InstanceStatus.Ongoing;
    }

    function vote(
        uint256 _instanceId,
        uint256 _candidateId
    ) public instanceMustExist(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];

        // Check if the voting has ended
        if (block.timestamp >= instance.endTime) {
            instance.status = InstanceStatus.Closed;
        }
        require(instance.status == InstanceStatus.Ongoing, "Voting not active");

        Candidate storage candidate = instance.candidates[_candidateId];
        require(candidate.id > 0, "Invalid candidate ID");

        bool alreadyVotedForRole = false;
        // Check if the voter has already voted for this role
        for (uint i = 0; i < instance.votedRoles[msg.sender].length; i++) {
            if (
                keccak256(bytes(instance.votedRoles[msg.sender][i])) ==
                keccak256(bytes(candidate.role))
            ) {
                alreadyVotedForRole = true;
                break; // Already voted for this role
            }
        }
        require(!alreadyVotedForRole, "Already voted for this role");

        // Add voter to voters array if they're not already in it
        if (instance.votedRoles[msg.sender].length == 0) {
            instance.voters.push(msg.sender);
        }

        candidate.voteCount++;
        instance.votedRoles[msg.sender].push(candidate.role); // Record the role voted for

        emit VoteCasted(_instanceId, _candidateId, msg.sender);
    }

    function getCandidateVotes(
        uint256 _instanceId,
        uint256 _candidateId
    ) public view returns (uint256) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            _candidateId <= instance.candidateCount,
            "Invalid candidate ID"
        );

        return instance.candidates[_candidateId].voteCount;
    }

    function getCandidateCount(
        uint256 _instanceId
    ) public view returns (uint256) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        return instance.candidateCount;
    }

    function getOverallResults(
        uint256 _instanceId
    )
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        uint256[] memory candidateIds = new uint256[](instance.candidateCount);
        string[] memory candidateNames = new string[](instance.candidateCount);
        string[] memory candidateRoles = new string[](instance.candidateCount);
        uint256[] memory voteCounts = new uint256[](instance.candidateCount);

        for (uint256 i = 0; i < instance.candidateCount; i++) {
            uint256 candidateId = i + 1;
            candidateIds[i] = candidateId;
            candidateNames[i] = instance.candidates[candidateId].name;
            candidateRoles[i] = instance.candidates[candidateId].role;
            voteCounts[i] = instance.candidates[candidateId].voteCount;
        }

        return (candidateIds, candidateNames, candidateRoles, voteCounts);
    }

    function getCandidate(
        uint256 _instanceId,
        uint256 _candidateId
    )
        public
        view
        returns (uint256, string memory, string memory, string memory, uint256)
    {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        require(
            _candidateId <= instance.candidateCount,
            "Invalid candidate ID"
        );
        Candidate storage candidate = instance.candidates[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.role,
            candidate.description,
            candidate.voteCount
        );
    }

    function getCandidates(
        uint256 _instanceId
    ) public view returns (Candidate[] memory) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];

        Candidate[] memory candidates = new Candidate[](
            instance.candidateCount
        );

        for (uint256 i = 0; i < instance.candidateCount; i++) {
            uint256 candidateId = i + 1;
            candidates[i] = instance.candidates[candidateId];
        }

        return candidates;
    }

    function getAllInstances()
        public
        view
        returns (VotingInstanceDetails[] memory)
    {
        VotingInstanceDetails[]
            memory allInstances = new VotingInstanceDetails[](instanceId);

        for (uint256 i = 1; i <= instanceId; i++) {
            VotingInstance storage instance = instances[i];
            allInstances[i - 1] = VotingInstanceDetails({
                id: instance.id,
                name: instance.name,
                organizationName: instance.organizationName,
                description: instance.description,
                creator: instance.creator,
                candidateCount: instance.candidateCount,
                status: instance.status
            });
        }

        return allInstances;
    }

    function deleteInstance(uint256 _instanceId) public onlyOwner(_instanceId) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        // Deleting the instance from the mapping
        delete instances[_instanceId];
        instances[_instanceId].exists = false;
    }

    function updateInstanceStatus(
        uint256 _instanceId
    ) public instanceMustExist(_instanceId) onlyOwner(_instanceId) {
        VotingInstance storage instance = instances[_instanceId];

        // Ensure that the function is called only if the status is not already Closed
        require(
            instance.status != InstanceStatus.Closed,
            "Instance is already closed"
        );

        // Check if the current time is past the endTime of the instance
        if (block.timestamp >= instance.endTime) {
            instance.status = InstanceStatus.Closed;
        } else if (
            block.timestamp >= instance.startTime &&
            block.timestamp < instance.endTime
        ) {
            instance.status = InstanceStatus.Ongoing;
        } else {
            instance.status = InstanceStatus.Open;
        }
    }

    function instanceExists(uint256 _instanceId) public view returns (bool) {
        return instances[_instanceId].exists;
    }

    function getVotersAndRoles(
        uint256 _instanceId
    ) public view returns (address[] memory, string[][] memory) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];

        string[][] memory rolesVotedFor = new string[][](
            instance.voters.length
        );
        for (uint i = 0; i < instance.voters.length; i++) {
            rolesVotedFor[i] = instance.votedRoles[instance.voters[i]];
        }

        return (instance.voters, rolesVotedFor);
    }

    function getVoterRoles(
        uint256 _instanceId,
        address voter
    ) public view returns (string[] memory) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];

        return instance.votedRoles[voter];
    }

    function getInstanceStatus(
        uint256 _instanceId
    ) public view returns (InstanceStatus) {
        require(_instanceId <= instanceId, "Invalid instance ID");
        VotingInstance storage instance = instances[_instanceId];
        return instance.status;
    }
}
